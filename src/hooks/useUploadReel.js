import { useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../services/firebase";

const CLOUDINARY_CLOUD_NAME = "sqqodjug";
const CLOUDINARY_UPLOAD_PRESET = "instagram_clon";

const useUploadReel = () => {
  const [loader, setLoader] = useState(false);

  const uploadReel = async (
    videoUri,
    currentUser,
    mimeType = "video/mp4"
  ) => {
    if (
      loader ||
      !videoUri ||
      !currentUser?.email
    ) {
      return false;
    }

    setLoader(true);

    try {
      const formData = new FormData();

      const extension =
        mimeType.split("/")[1] || "mp4";

      formData.append("file", {
        uri: videoUri,
        type: mimeType,
        name: `reel_${Date.now()}.${extension}`,
      });

      formData.append(
        "upload_preset",
        CLOUDINARY_UPLOAD_PRESET
      );

      formData.append(
        "folder",
        `instagram/${currentUser.email}/reels`
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Cloudinary reel upload error:",
          data
        );

        throw new Error(
          data?.error?.message ||
            "Cloudinary reel upload failed"
        );
      }

      if (!data?.secure_url) {
        throw new Error(
          "Cloudinary returned no video URL"
        );
      }

      await addDoc(
        collection(
          db,
          "users",
          currentUser.email,
          "reels"
        ),
        {
          videoUrl: data.secure_url,
          username:
            currentUser.username || "",
          profile_picture:
            currentUser.profile_picture || "",
          owner_uid:
            currentUser.owner_uid || "",
          owner_email:
            currentUser.email,
          createdAt:
            serverTimestamp(),
          likes_by_users: [],
          comments: [],
          shared: 0,
          duration:
            data?.duration || 0,
          width:
            data?.width || 0,
          height:
            data?.height || 0,
          resourceType:
            data?.resource_type || "video",
          publicId:
            data?.public_id || "",
        }
      );

      return true;
    } catch (error) {
      console.error(
        "Reel upload failed:",
        error
      );

      return false;
    } finally {
      setLoader(false);
    }
  };

  return {
    uploadReel,
    loader,
  };
};

export default useUploadReel;

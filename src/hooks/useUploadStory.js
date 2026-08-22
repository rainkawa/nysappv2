import { useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import useUploadPicture from "./useUploadPicture";
import { db } from "../services/firebase";

const useUploadStory = () => {
  const [isLoading, setIsLoading] =
    useState(false);

  const {
    uploadPicture,
  } = useUploadPicture();

  const uploadStory = async (
    imageUri,
    currentUser
  ) => {
    if (
      isLoading ||
      !imageUri ||
      !currentUser?.email
    ) {
      return false;
    }

    setIsLoading(true);

    try {
      const uploadedImageUrl =
        await uploadPicture(
          imageUri,
          currentUser.email,
          `story_${Date.now()}`
        );

      if (!uploadedImageUrl) {
        throw new Error(
          "Cloudinary story upload failed."
        );
      }

      await addDoc(
        collection(
          db,
          "users",
          currentUser.email,
          "stories"
        ),
        {
          imageUrl:
            uploadedImageUrl,

          username:
            currentUser.username || "",

          name:
            currentUser.name || "",

          profile_picture:
            currentUser.profile_picture ||
            "",

          owner_uid:
            currentUser.owner_uid || "",

          owner_email:
            currentUser.email,

          createdAt:
            serverTimestamp(),

          likes_by_users: [],

          new_likes: [],

          seen_by_users: [],
        }
      );

      return true;
    } catch (error) {
      console.error(
        "Story upload error:",
        error
      );

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadStory,
    isLoading,
  };
};

export default useUploadStory;

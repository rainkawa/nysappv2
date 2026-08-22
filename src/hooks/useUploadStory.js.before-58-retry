import { useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import useUploadPicture from "./useUploadPicture";
import { db } from "../services/firebase";

const useUploadStory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { uploadPicture } = useUploadPicture();

  const uploadStory = async (imageUrl, currentUser) => {
    if (isLoading) return false;

    if (!imageUrl || !currentUser?.email) {
      console.error("Story upload: missing image or user information.");
      return false;
    }

    setIsLoading(true);

    try {
      const timestamp = Date.now();

      const uploadedImageUrl = await uploadPicture(
        imageUrl,
        currentUser.email,
        timestamp
      );

      if (!uploadedImageUrl) {
        throw new Error("Story image upload failed.");
      }

      const newStory = {
        imageUrl: uploadedImageUrl,
        username: currentUser.username,
        name: currentUser.name,
        profile_picture: currentUser.profile_picture,
        owner_uid: currentUser.owner_uid,
        owner_email: currentUser.email,
        createdAt: serverTimestamp(),
        likes_by_users: [],
        new_likes: [],
        seen_by_users: [],
      };

      const storiesCollectionRef = collection(
        db,
        "users",
        currentUser.email,
        "stories"
      );

      await addDoc(storiesCollectionRef, newStory);

      return true;
    } catch (error) {
      console.error("Story upload failed:", error);
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

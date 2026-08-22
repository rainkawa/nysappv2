import { useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  Timestamp,
  increment,
  collection,
  addDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";

const useUploadComment = (post, currentUser) => {
  const [isLoading, setIsLoading] = useState(false);

  const uploadComment = async (value) => {
    if (isLoading) return false;

    const commentText = String(value || "").trim();

    if (
      !commentText ||
      !post?.owner_email ||
      !post?.id ||
      !currentUser?.email
    ) {
      return false;
    }

    setIsLoading(true);

    try {
      const postRef = doc(
        db,
        "users",
        post.owner_email,
        "posts",
        post.id
      );

      const snapshot = await getDoc(postRef);

      if (!snapshot.exists()) {
        console.log("No such post document!");
        return false;
      }

      const createdAt = Timestamp.now();

      const newComment = {
        email: currentUser.email,
        profile_picture: currentUser.profile_picture || "",
        username: currentUser.username || "",
        comment: commentText,
        createdAt,
        likes_by_users: [],
      };

      await updateDoc(postRef, {
        comments: arrayUnion(newComment),
      });

      if (post.owner_email !== currentUser.email) {
        const ownerRef = doc(
          db,
          "users",
          post.owner_email
        );

        await addDoc(
          collection(
            db,
            "users",
            post.owner_email,
            "notifications"
          ),
          {
            type: "comment",
            actorEmail: currentUser.email,
            actorUsername: currentUser.username || "",
            actorProfilePicture:
              currentUser.profile_picture || "",
            postId: post.id,
            postOwnerEmail: post.owner_email,
            postImage: post.imageUrl || "",
            comment: commentText,
            createdAt,
          }
        );

        await updateDoc(ownerRef, {
          event_notification: increment(1),
        });
      }

      return true;
    } catch (error) {
      console.error("Comment upload error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadComment,
    isLoading,
  };
};

export default useUploadComment;

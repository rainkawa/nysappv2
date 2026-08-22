import { useState } from "react";
import {
  doc,
  updateDoc,
  arrayUnion,
  Timestamp,
  increment,
  collection,
  addDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";

const useUploadComment = (
  post,
  currentUser
) => {
  const [isLoading, setIsLoading] =
    useState(false);

  const uploadComment = async (
    value
  ) => {
    if (isLoading) {
      return false;
    }

    const commentText = String(
      value || ""
    ).trim();

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
      const createdAt =
        Timestamp.now();

      const newComment = {
        email:
          currentUser.email,

        profile_picture:
          currentUser.profile_picture ||
          "",

        username:
          currentUser.username ||
          "",

        comment:
          commentText,

        createdAt,

        likes_by_users: [],
      };

      const postRef = doc(
        db,
        "users",
        post.owner_email,
        "posts",
        post.id
      );

      await updateDoc(
        postRef,
        {
          comments:
            arrayUnion(
              newComment
            ),
        }
      );

      if (
        post.owner_email !==
        currentUser.email
      ) {
        await addDoc(
          collection(
            db,
            "users",
            post.owner_email,
            "notifications"
          ),
          {
            type: "comment",

            actorEmail:
              currentUser.email,

            actorUsername:
              currentUser.username ||
              "",

            actorProfilePicture:
              currentUser.profile_picture ||
              "",

            postId:
              post.id,

            postOwnerEmail:
              post.owner_email,

            postImage:
              post.imageUrl ||
              "",

            comment:
              commentText,

            createdAt,
          }
        );

        await updateDoc(
          doc(
            db,
            "users",
            post.owner_email
          ),
          {
            event_notification:
              increment(1),
          }
        );
      }

      return true;
    } catch (error) {
      console.error(
        "Comment upload error:",
        error
      );

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

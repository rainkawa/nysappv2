import { useState } from "react";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  Timestamp,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../services/firebase";

const useHandleLike = () => {
  const [loader, setLoader] = useState(false);

  const handlePostLike = async (post, currentUser) => {
    if (loader) return;

    if (
      !post?.id ||
      !post?.owner_email ||
      !currentUser?.email
    ) {
      return;
    }

    setLoader(true);

    const likes = Array.isArray(post.likes_by_users)
      ? post.likes_by_users
      : [];

    const currentLikeStatus = !likes.includes(
      currentUser.email
    );

    try {
      const postRef = doc(
        db,
        "users",
        post.owner_email,
        "posts",
        post.id
      );

      const ownerRef = doc(
        db,
        "users",
        post.owner_email
      );

      const update = {
        likes_by_users: currentLikeStatus
          ? arrayUnion(currentUser.email)
          : arrayRemove(currentUser.email),
      };

      // Keep the old field for backward compatibility.
      if (currentLikeStatus) {
        update.new_likes = [
          currentUser.username,
          currentUser.profile_picture,
          currentUser.email,
          Timestamp.now(),
        ];
      } else {
        update.new_likes = [];
      }

      await updateDoc(postRef, update);

      if (post.owner_email !== currentUser.email) {
        const notificationsRef = collection(
          db,
          "users",
          post.owner_email,
          "notifications"
        );

        if (currentLikeStatus) {
          await addDoc(notificationsRef, {
            type: "like",
            actorEmail: currentUser.email,
            actorUsername:
              currentUser.username || "",
            actorProfilePicture:
              currentUser.profile_picture || "",
            postId: post.id,
            postOwnerEmail: post.owner_email,
            postImage: post.imageUrl || "",
            createdAt: Timestamp.now(),
          });

          await updateDoc(ownerRef, {
            event_notification: increment(1),
          });
        } else {
          // Remove the user's existing like notification
          // for this post when they unlike it.
          const existing = await getDocs(
            query(
              notificationsRef,
              where("type", "==", "like"),
              where(
                "actorEmail",
                "==",
                currentUser.email
              ),
              where(
                "postId",
                "==",
                post.id
              )
            )
          );

          for (const notification of existing.docs) {
            await updateDoc(
              doc(
                db,
                "users",
                post.owner_email,
                "notifications",
                notification.id
              ),
              {
                deleted: true,
              }
            );
          }

          await updateDoc(ownerRef, {
            event_notification: increment(-1),
          });
        }
      }
    } catch (error) {
      console.error(
        "Error updating post like:",
        error
      );
    } finally {
      setLoader(false);
    }
  };

  const handleStoryLike = async (
    story,
    currentUser
  ) => {
    if (loader) return;

    if (
      !story?.id ||
      !story?.owner_email ||
      !currentUser?.email
    ) {
      return;
    }

    setLoader(true);

    const likes = Array.isArray(
      story.likes_by_users
    )
      ? story.likes_by_users
      : [];

    const currentLikeStatus = !likes.includes(
      currentUser.email
    );

    try {
      const storyRef = doc(
        db,
        "users",
        story.owner_email,
        "stories",
        story.id
      );

      await updateDoc(storyRef, {
        likes_by_users: currentLikeStatus
          ? arrayUnion(currentUser.email)
          : arrayRemove(currentUser.email),
      });
    } catch (error) {
      console.error(
        "Error updating story like:",
        error
      );
    } finally {
      setLoader(false);
    }
  };

  return {
    handlePostLike,
    handleStoryLike,
  };
};

export default useHandleLike;

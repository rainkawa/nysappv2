import { useUserContext } from "../contexts/UserContext";
import {
  arrayUnion,
  arrayRemove,
  doc,
  getDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../services/firebase";

const useHandleFollow = () => {
  const { currentUser } = useUserContext();

  const handleFollow = async (userEmail) => {
    if (
      !currentUser?.email ||
      !userEmail ||
      currentUser.email === userEmail
    ) {
      return false;
    }

    try {
      const targetUserRef = doc(
        db,
        "users",
        userEmail
      );

      const currentUserRef = doc(
        db,
        "users",
        currentUser.email
      );

      const targetSnapshot = await getDoc(
        targetUserRef
      );

      if (!targetSnapshot.exists()) {
        return false;
      }

      const targetUser = targetSnapshot.data();

      const following = Array.isArray(
        currentUser.following
      )
        ? currentUser.following
        : [];

      const followingRequests = Array.isArray(
        currentUser.following_request
      )
        ? currentUser.following_request
        : [];

      if (following.includes(userEmail)) {
        return false;
      }

      const isRequested =
        followingRequests.includes(userEmail);

      const targetIsPrivate =
        targetUser?.isPrivate === true;

      const batch = writeBatch(db);

      if (targetIsPrivate) {
        if (isRequested) {
          batch.update(targetUserRef, {
            followers_request:
              arrayRemove(currentUser.email),
          });

          batch.update(currentUserRef, {
            following_request:
              arrayRemove(userEmail),
          });
        } else {
          batch.update(targetUserRef, {
            followers_request:
              arrayUnion(currentUser.email),
          });

          batch.update(currentUserRef, {
            following_request:
              arrayUnion(userEmail),
          });
        }
      } else {
        batch.update(targetUserRef, {
          followers:
            arrayUnion(currentUser.email),
        });

        batch.update(currentUserRef, {
          following:
            arrayUnion(userEmail),

          following_request:
            arrayRemove(userEmail),
        });

        batch.update(targetUserRef, {
          followers_request:
            arrayRemove(currentUser.email),
        });
      }

      await batch.commit();

      return true;
    } catch (error) {
      console.error(
        "Error handling follow:",
        error
      );

      return false;
    }
  };

  return {
    handleFollow,
  };
};

export default useHandleFollow;

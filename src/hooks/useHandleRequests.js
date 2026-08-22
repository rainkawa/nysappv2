import {
  arrayRemove,
  arrayUnion,
  doc,
  increment,
  writeBatch,
} from "firebase/firestore";
import { db } from "../services/firebase";

const useHandleRequests = ({
  currentUser,
  user,
}) => {
  const handleRequests = async (accept) => {
    if (
      !currentUser?.email ||
      !user?.email ||
      currentUser.email === user.email
    ) {
      return false;
    }

    try {
      const currentUserRef = doc(
        db,
        "users",
        currentUser.email
      );

      const requesterRef = doc(
        db,
        "users",
        user.email
      );

      const batch = writeBatch(db);

      batch.update(
        currentUserRef,
        {
          followers_request:
            arrayRemove(user.email),
        }
      );

      batch.update(
        requesterRef,
        {
          following_request:
            arrayRemove(
              currentUser.email
            ),
        }
      );

      if (accept) {
        // Current user accepted the request:
        // currentUser becomes the requester's follower.
        batch.update(
          currentUserRef,
          {
            followers:
              arrayUnion(user.email),
          }
        );

        // Requester becomes a follower of currentUser.
        batch.update(
          requesterRef,
          {
            following:
              arrayUnion(
                currentUser.email
              ),
          }
        );

        batch.update(
          requesterRef,
          {
            event_notification:
              increment(1),
          }
        );
      }

      await batch.commit();

      return true;
    } catch (error) {
      console.error(
        "Error handling follow request:",
        error
      );

      return false;
    }
  };

  return {
    handleRequests,
  };
};

export default useHandleRequests;

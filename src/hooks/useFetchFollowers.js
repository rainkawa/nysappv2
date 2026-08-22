import { useEffect, useState } from "react";
import {
  collection,
  documentId,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../services/firebase";

const useFetchFollowers = ({ user }) => {
  const [loader, setLoader] = useState(false);
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const followerIds = Array.isArray(user?.followers)
      ? user.followers.filter(Boolean)
      : [];

    if (followerIds.length === 0) {
      setFollowers([]);
      setLoader(false);
      return undefined;
    }

    // Firestore "in" queries accept a maximum of 30 values.
    const chunks = [];

    for (let i = 0; i < followerIds.length; i += 30) {
      chunks.push(followerIds.slice(i, i + 30));
    }

    setLoader(true);

    const unsubscribers = [];
    const usersById = new Map();

    chunks.forEach((chunk) => {
      const usersQuery = query(
        collection(db, "users"),
        where(documentId(), "in", chunk)
      );

      const unsubscribe = onSnapshot(
        usersQuery,
        (snapshot) => {
          snapshot.docs.forEach((userDoc) => {
            usersById.set(userDoc.id, {
              id: userDoc.id,
              ...userDoc.data(),
            });
          });

          // Keep the same order as the IDs stored on the user document.
          const orderedFollowers = followerIds
            .map((id) => usersById.get(id))
            .filter(Boolean);

          setFollowers(orderedFollowers);

          const allChunksLoaded = chunks.every((ids) =>
            ids.every((id) => usersById.has(id))
          );

          if (allChunksLoaded) {
            setLoader(false);
          }
        },
        (error) => {
          console.error(
            "useFetchFollowers error:",
            error
          );
          setLoader(false);
        }
      );

      unsubscribers.push(unsubscribe);
    });

    return () => {
      unsubscribers.forEach((unsubscribe) =>
        unsubscribe()
      );
    };
  }, [user?.followers]);

  return {
    followers,
    loader,
  };
};

export default useFetchFollowers;

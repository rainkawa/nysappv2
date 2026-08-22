import { useEffect, useState } from "react";
import {
  collection,
  documentId,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../services/firebase";

const useFetchFollowing = ({ user }) => {
  const [loader, setLoader] = useState(false);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const followingIds = Array.isArray(user?.following)
      ? user.following.filter(Boolean)
      : [];

    if (followingIds.length === 0) {
      setFollowing([]);
      setLoader(false);
      return undefined;
    }

    // Firestore "in" queries accept a maximum of 30 values.
    const chunks = [];

    for (let i = 0; i < followingIds.length; i += 30) {
      chunks.push(followingIds.slice(i, i + 30));
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

          const orderedFollowing = followingIds
            .map((id) => usersById.get(id))
            .filter(Boolean);

          setFollowing(orderedFollowing);

          const allChunksLoaded = chunks.every((ids) =>
            ids.every((id) => usersById.has(id))
          );

          if (allChunksLoaded) {
            setLoader(false);
          }
        },
        (error) => {
          console.error(
            "useFetchFollowing error:",
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
  }, [user?.following]);

  return {
    following,
    loader,
  };
};

export default useFetchFollowing;

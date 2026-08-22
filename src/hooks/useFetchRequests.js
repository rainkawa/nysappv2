import { useEffect, useState } from "react";
import {
  collection,
  documentId,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../services/firebase";

const useFetchRequests = ({ user }) => {
  const [loader, setLoader] = useState(false);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const requestIds = Array.isArray(
      user?.followers_request
    )
      ? user.followers_request.filter(Boolean)
      : [];

    if (requestIds.length === 0) {
      setRequests([]);
      setLoader(false);
      return undefined;
    }

    const chunks = [];

    for (let i = 0; i < requestIds.length; i += 30) {
      chunks.push(requestIds.slice(i, i + 30));
    }

    setLoader(true);

    const unsubscribers = [];
    const usersById = new Map();

    chunks.forEach((chunk) => {
      const requestsQuery = query(
        collection(db, "users"),
        where(documentId(), "in", chunk)
      );

      const unsubscribe = onSnapshot(
        requestsQuery,
        (snapshot) => {
          snapshot.docs.forEach((requestDoc) => {
            usersById.set(requestDoc.id, {
              id: requestDoc.id,
              ...requestDoc.data(),
            });
          });

          const orderedRequests = requestIds
            .map((id) => usersById.get(id))
            .filter(Boolean);

          setRequests(orderedRequests);

          const loaded = chunks.every((ids) =>
            ids.every((id) =>
              usersById.has(id)
            )
          );

          if (loaded) {
            setLoader(false);
          }
        },
        (error) => {
          console.error(
            "useFetchRequests error:",
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
  }, [user?.followers_request]);

  return {
    requests,
    loader,
  };
};

export default useFetchRequests;

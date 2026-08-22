import { useCallback, useEffect, useState } from "react";
import {
  collectionGroup,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../services/firebase";

const useFetchReels = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] =
    useState(0);

  useEffect(() => {
    setIsLoading(true);

    const reelsCollection = collectionGroup(
      db,
      "reels"
    );

    const unsubscribe = onSnapshot(
      reelsCollection,
      (snapshot) => {
        const updatedVideos =
          snapshot.docs.map((reelDoc, index) => ({
            id: reelDoc.id,
            index,
            ...reelDoc.data(),
          }));

        setVideos(updatedVideos);
        setIsLoading(false);
      },
      (error) => {
        console.error(
          "useFetchReels error:",
          error
        );
        setVideos([]);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [refreshKey]);

  const refreshReels = useCallback(() => {
    setRefreshKey(
      (previous) => previous + 1
    );
  }, []);

  return {
    videos,
    isLoading,
    refreshReels,
  };
};

export default useFetchReels;

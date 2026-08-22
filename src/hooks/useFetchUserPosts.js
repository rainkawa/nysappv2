import { useEffect, useState } from "react";
import {
  collection,
  doc,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../services/firebase";

const normalizePost = (post) => {
  const data = post.data() || {};

  return {
    id: post.id,
    ...data,
    comments: Array.isArray(data.comments)
      ? data.comments
      : [],
    new_likes: Array.isArray(data.new_likes)
      ? data.new_likes
      : [],
  };
};

const useFetchUserPosts = (email) => {
  const [posts, setPosts] = useState([]);
  const [loadLimit, setLoadLimit] = useState(20);
  const [loader, setLoader] = useState(false);
  const [onSnapshotData, setOnSnapshotData] = useState([]);
  const [timeToReplaceData, setTimeToReplaceData] = useState(0);

  useEffect(() => {
    if (!email) {
      setPosts([]);
      setOnSnapshotData([]);
      setLoader(false);
      return undefined;
    }

    setLoader(true);

    const postsRef = collection(
      doc(db, "users", email),
      "posts"
    );

    const postsQuery = query(
      postsRef,
      orderBy("createdAt", "desc"),
      limit(loadLimit)
    );

    const unsubscribe = onSnapshot(
      postsQuery,
      (snapshot) => {
        const data = snapshot.docs.map(normalizePost);

        setOnSnapshotData(data);
        setPosts(data);
        setTimeToReplaceData(
          (previous) => previous + 1
        );
        setLoader(false);
      },
      (error) => {
        console.error(
          "useFetchUserPosts error:",
          error
        );

        setPosts([]);
        setOnSnapshotData([]);
        setLoader(false);
      }
    );

    return unsubscribe;
  }, [email, loadLimit]);

  const fetchOlderPosts = () => {
    setLoadLimit(
      (previous) => previous + 10
    );
  };

  const refreshPosts = () => {
    setLoadLimit(20);
  };

  return {
    posts,
    loader,
    fetchOlderPosts,
    refreshPosts,
    onSnapshotData,
    timeToReplaceData,
  };
};

export default useFetchUserPosts;

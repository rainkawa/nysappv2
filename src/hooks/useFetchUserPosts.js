import {
  useEffect,
  useState,
} from "react";
import {
  collection,
  doc,
  getDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../services/firebase";
import {
  useUserContext,
} from "../contexts/UserContext";

const normalizePost = (
  post
) => {
  const data =
    post.data() || {};

  return {
    id: post.id,
    ...data,

    comments:
      Array.isArray(
        data.comments
      )
        ? data.comments
        : [],

    new_likes:
      Array.isArray(
        data.new_likes
      )
        ? data.new_likes
        : [],
  };
};

const useFetchUserPosts = (
  email
) => {
  const {
    currentUser,
  } = useUserContext();

  const [posts, setPosts] =
    useState([]);

  const [loadLimit, setLoadLimit] =
    useState(20);

  const [loader, setLoader] =
    useState(false);

  useEffect(() => {
    let unsubscribe;
    let cancelled = false;

    const load = async () => {
      if (!email) {
        setPosts([]);
        setLoader(false);
        return;
      }

      setLoader(true);

      try {
        const ownerSnapshot =
          await getDoc(
            doc(db, "users", email)
          );

        if (
          !ownerSnapshot.exists()
        ) {
          setPosts([]);
          setLoader(false);
          return;
        }

        const owner =
          ownerSnapshot.data();

        const isOwner =
          currentUser?.email ===
          email;

        if (
          owner.isPrivate === true &&
          !isOwner
        ) {
          const followers =
            Array.isArray(
              owner.followers
            )
              ? owner.followers
              : [];

          const isFollower =
            followers.includes(
              currentUser?.email
            );

          if (!isFollower) {
            setPosts([]);
            setLoader(false);
            return;
          }
        }

        const postsRef =
          collection(
            doc(
              db,
              "users",
              email
            ),
            "posts"
          );

        const postsQuery =
          query(
            postsRef,
            orderBy(
              "createdAt",
              "desc"
            ),
            limit(loadLimit)
          );

        unsubscribe = onSnapshot(
          postsQuery,
          (snapshot) => {
            if (cancelled) {
              return;
            }

            setPosts(
              snapshot.docs.map(
                normalizePost
              )
            );

            setLoader(false);
          },
          (error) => {
            console.error(
              "useFetchUserPosts error:",
              error
            );

            if (!cancelled) {
              setPosts([]);
              setLoader(false);
            }
          }
        );
      } catch (error) {
        console.error(
          "useFetchUserPosts access error:",
          error
        );

        if (!cancelled) {
          setPosts([]);
          setLoader(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;

      if (
        typeof unsubscribe ===
        "function"
      ) {
        unsubscribe();
      }
    };
  }, [
    email,
    currentUser?.email,
    loadLimit,
  ]);

  const fetchOlderPosts = () => {
    setLoadLimit(
      (previous) =>
        previous + 10
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
  };
};

export default useFetchUserPosts;

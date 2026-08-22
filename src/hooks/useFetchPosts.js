import {
  useEffect,
  useState,
} from "react";
import {
  collectionGroup,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import {
  useUserContext,
} from "../contexts/UserContext";

const useFetchPosts = () => {
  const {
    currentUser,
  } = useUserContext();

  const [posts, setPosts] =
    useState([]);

  const [loadLimit, setLoadLimit] =
    useState(40);

  const [isLoading, setIsLoading] =
    useState(false);

  const [justRequested, setJustRequested] =
    useState(false);

  useEffect(() => {
    if (!currentUser?.email) {
      setPosts([]);
      setIsLoading(false);
      return undefined;
    }

    setIsLoading(true);

    const postsQuery = query(
      collectionGroup(db, "posts"),
      orderBy(
        "createdAt",
        "desc"
      ),
      limit(loadLimit)
    );

    const unsubscribe =
      onSnapshot(
        postsQuery,
        async (snapshot) => {
          try {
            const rawPosts =
              snapshot.docs.map(
                (post) => ({
                  id: post.id,
                  ...post.data(),
                })
              );

            const ownerEmails = [
              ...new Set(
                rawPosts
                  .map(
                    (post) =>
                      post.owner_email
                  )
                  .filter(Boolean)
              ),
            ];

            const ownerResults =
              await Promise.all(
                ownerEmails.map(
                  async (email) => {
                    try {
                      const ownerSnapshot =
                        await getDoc(
                          doc(
                            db,
                            "users",
                            email
                          )
                        );

                      return [
                        email,
                        ownerSnapshot.exists()
                          ? ownerSnapshot.data()
                          : null,
                      ];
                    } catch {
                      return [
                        email,
                        null,
                      ];
                    }
                  }
                )
              );

            const owners = new Map(
              ownerResults
            );

            const visiblePosts =
              rawPosts.filter(
                (post) => {
                  const owner =
                    owners.get(
                      post.owner_email
                    );

                  if (!owner) {
                    return false;
                  }

                  // Own posts are always visible.
                  if (
                    owner.email ===
                    currentUser.email
                  ) {
                    return true;
                  }

                  // Public accounts are visible.
                  if (
                    owner.isPrivate !== true
                  ) {
                    return true;
                  }

                  // Private account:
                  // only approved followers can see.
                  const followers =
                    Array.isArray(
                      owner.followers
                    )
                      ? owner.followers
                      : [];

                  return followers.includes(
                    currentUser.email
                  );
                }
              );

            setPosts(
              visiblePosts
            );
          } catch (error) {
            console.error(
              "Error filtering posts:",
              error
            );

            setPosts([]);
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error(
            "Error fetching posts:",
            error
          );

          setPosts([]);
          setIsLoading(false);
        }
      );

    return unsubscribe;
  }, [
    currentUser?.email,
    loadLimit,
  ]);

  const fetchOlderPosts = () => {
    if (justRequested) {
      return;
    }

    setJustRequested(true);

    setTimeout(() => {
      setJustRequested(false);
    }, 1500);

    setLoadLimit(
      (previous) =>
        previous + 20
    );
  };

  const refreshPosts = () => {
    setLoadLimit(40);
  };

  return {
    posts,
    isLoading,
    fetchOlderPosts,
    refreshPosts,
  };
};

export default useFetchPosts;

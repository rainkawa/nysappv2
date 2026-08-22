import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../services/firebase";

const useFindUsers = ({
  currentUser,
  searchKey,
}) => {
  const [users, setUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    if (!currentUser?.email) {
      setUsers([]);
      return undefined;
    }

    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const data = snapshot.docs
          .map((userDoc) => ({
            id: userDoc.id,
            ...userDoc.data(),
          }))
          .filter(
            (user) =>
              Boolean(user?.email) &&
              Boolean(user?.username)
          );

        setUsers(data);
      },
      (error) => {
        console.error(
          "useFindUsers listener error:",
          error
        );
        setUsers([]);
      }
    );

    return unsubscribe;
  }, [currentUser?.email]);

  useEffect(() => {
    const normalizedSearch = String(
      searchKey || ""
    )
      .trim()
      .toLowerCase();

    if (!normalizedSearch) {
      setSearchResult([]);
      return;
    }

    const filtered = users.filter((user) => {
      const username = String(
        user?.username || ""
      ).toLowerCase();

      const name = String(
        user?.name || ""
      ).toLowerCase();

      const email = String(
        user?.email || ""
      ).toLowerCase();

      return (
        username.includes(normalizedSearch) ||
        name.includes(normalizedSearch) ||
        email.includes(normalizedSearch)
      );
    });

    setSearchResult(filtered);
  }, [searchKey, users]);

  return {
    beginSearch: () => {},
    users,
    searchResult,
  };
};

export default useFindUsers;

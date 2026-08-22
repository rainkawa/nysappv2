import {
  useEffect,
  useState,
} from "react";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../services/firebase";

const getMillis = (value) => {
  if (!value) {
    return 0;
  }

  if (
    typeof value.toMillis ===
    "function"
  ) {
    return value.toMillis();
  }

  if (
    typeof value.seconds ===
    "number"
  ) {
    return value.seconds * 1000;
  }

  if (typeof value === "number") {
    return value;
  }

  return 0;
};

const useFetchNotifications = ({
  user,
}) => {
  const [loader, setLoader] =
    useState(false);

  const [notifications, setNotifications] =
    useState([]);

  useEffect(() => {
    if (!user?.email) {
      setNotifications([]);
      setLoader(false);
      return undefined;
    }

    setLoader(true);

    const notificationsRef =
      collection(
        db,
        "users",
        user.email,
        "notifications"
      );

    const unsubscribe = onSnapshot(
      notificationsRef,
      (snapshot) => {
        const data = snapshot.docs
          .map(
            (notificationDoc) => ({
              id: notificationDoc.id,
              ...notificationDoc.data(),
            })
          )
          .filter(
            (item) =>
              item.deleted !== true
          )
          .sort(
            (a, b) =>
              getMillis(
                b.createdAt
              ) -
              getMillis(
                a.createdAt
              )
          );

        setNotifications(data);
        setLoader(false);
      },
      (error) => {
        console.error(
          "useFetchNotifications error:",
          error
        );

        setNotifications([]);
        setLoader(false);
      }
    );

    return unsubscribe;
  }, [user?.email]);

  return {
    notifications,
    loader,
  };
};

export default useFetchNotifications;

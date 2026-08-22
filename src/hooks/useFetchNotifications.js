import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../services/firebase";

const useFetchNotifications = ({ user }) => {
  const [loader, setLoader] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user?.email) {
      setNotifications([]);
      setLoader(false);
      return undefined;
    }

    setLoader(true);

    const notificationsRef = collection(
      db,
      "users",
      user.email,
      "notifications"
    );

    const notificationsQuery = query(
      notificationsRef,
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const data = snapshot.docs.map(
          (notificationDoc) => ({
            id: notificationDoc.id,
            ...notificationDoc.data(),
          })
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

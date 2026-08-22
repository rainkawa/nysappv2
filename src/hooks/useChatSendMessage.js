import { useState } from "react";
import {
  doc,
  collection,
  writeBatch,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../services/firebase";
import useChatAddUser from "./useChatAddUser";

const useChatSendMessage = ({
  user,
  currentUser,
}) => {
  const { chatAddUser } =
    useChatAddUser();

  const [loading, setLoading] =
    useState(false);

  const [textMessage, setTextMessage] =
    useState("");

  const chatSendMessage = async () => {
    const text = String(
      textMessage || ""
    ).trim();

    if (
      loading ||
      !user?.email ||
      !currentUser?.email ||
      currentUser.email === user.email ||
      !text
    ) {
      return false;
    }

    setLoading(true);

    try {
      if (user.status === undefined) {
        await chatAddUser(user);
      }

      const batch = writeBatch(db);

      const userRef = doc(
        db,
        "users",
        user.email
      );

      const currentChatRef = doc(
        db,
        "users",
        currentUser.email,
        "chat",
        user.email
      );

      const newUserChatRef = doc(
        db,
        "users",
        user.email,
        "chat",
        currentUser.email
      );

      const currentMessageRef = doc(
        collection(
          currentChatRef,
          "messages"
        )
      );

      const newUserMessageRef = doc(
        collection(
          newUserChatRef,
          "messages"
        )
      );

      batch.set(
        userRef,
        {
          chat_notification:
            increment(1),
        },
        { merge: true }
      );

      batch.set(
        newUserChatRef,
        {
          email: currentUser.email,
          name: currentUser.name,
          profile_picture:
            currentUser.profile_picture,
          username:
            currentUser.username,
          status: "unseen",
        },
        { merge: true }
      );

      batch.set(
        currentMessageRef,
        {
          message: text,
          timestamp:
            serverTimestamp(),
          who: "current",
        }
      );

      batch.set(
        newUserMessageRef,
        {
          message: text,
          timestamp:
            serverTimestamp(),
          who: "user",
        }
      );

      await batch.commit();

      setTextMessage("");

      return true;
    } catch (error) {
      console.error(
        "Error sending message:",
        error
      );

      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    chatSendMessage,
    loading,
    textMessage,
    setTextMessage,
  };
};

export default useChatSendMessage;

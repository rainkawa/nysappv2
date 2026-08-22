import { useUserContext } from "../contexts/UserContext";
import {
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";

const useChatAddUser = () => {
  const { currentUser } =
    useUserContext();

  const chatAddUser = async (user) => {
    if (
      !currentUser?.email ||
      !user?.email ||
      currentUser.email === user.email
    ) {
      return false;
    }

    const newUser = {
      email: user.email,
      username:
        user.username || "",
      name: user.name || "",
      profile_picture:
        user.profile_picture || "",
      status: "seen",
    };

    await setDoc(
      doc(
        db,
        "users",
        currentUser.email,
        "chat",
        user.email
      ),
      newUser,
      { merge: true }
    );

    return true;
  };

  return {
    chatAddUser,
  };
};

export default useChatAddUser;

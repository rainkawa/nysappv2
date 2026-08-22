import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  useState,
  useEffect,
  useRef,
} from "react";
import {
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import StoryHighlights from "../components/user/StoryHighlights";
import {
  useUserContext,
} from "../contexts/UserContext";
import BottomSheetOptions from "../components/user/bottomSheets/BottomSheetOptions";
import CopyClipboardModal from "../components/shared/modals/CopyClipboardModal";
import {
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../services/firebase";
import {
  SafeAreaView,
} from "react-native-safe-area-context";

const User = ({
  route,
  navigation,
}) => {
  const {
    email,
  } = route.params || {};

  const [user, setUser] =
    useState({});

  const {
    currentUser,
  } = useUserContext();

  const bottomSheetRefOptions =
    useRef(null);

  const [
    copyModalVisible,
    setCopyModalVisible,
  ] = useState(false);

  useEffect(() => {
    if (!email) {
      setUser({});
      return undefined;
    }

    const userRef =
      doc(db, "users", email);

    const unsubscribe =
      onSnapshot(
        userRef,
        (snapshot) => {
          if (
            snapshot.exists()
          ) {
            setUser(
              snapshot.data()
            );
          } else {
            setUser({});
          }
        },
        (error) => {
          console.error(
            "UserDetail error:",
            error
          );

          setUser({});
        }
      );

    return unsubscribe;
  }, [email]);

  const isSelf =
    currentUser?.email ===
    user?.email;

  const followers =
    Array.isArray(
      user?.followers
    )
      ? user.followers
      : [];

  const isFollowing =
    followers.includes(
      currentUser?.email
    );

  const isPrivate =
    user?.isPrivate === true;

  const canViewPrivateContent =
    !isPrivate ||
    isSelf ||
    isFollowing;

  return (
    <SafeAreaView
      style={styles.container}
      edges={[
        "top",
        "bottom",
      ]}
    >
      <View
        style={styles.titleContainer}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
          hitSlop={8}
        >
          <MaterialIcons
            name="arrow-back-ios"
            size={22}
            color="#fff"
          />
        </TouchableOpacity>

        <Text
          style={styles.textTitle}
        >
          {user?.username || ""}
        </Text>

        {user?.username ? (
          <TouchableOpacity
            onPress={() =>
              bottomSheetRefOptions.current?.present()
            }
            hitSlop={8}
          >
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={23}
              color="#fff"
            />
          </TouchableOpacity>
        ) : (
          <ActivityIndicator
            color="#fff"
          />
        )}
      </View>

      {user?.email &&
      !isSelf &&
      isPrivate &&
      !canViewPrivateContent ? (
        <View
          style={
            styles.privateContainer
          }
        >
          <View
            style={styles.lockCircle}
          >
            <MaterialCommunityIcons
              name="lock-outline"
              size={28}
              color="#fff"
            />
          </View>

          <Text
            style={styles.privateTitle}
          >
            This account is private
          </Text>

          <Text
            style={styles.privateText}
          >
            Follow this account to see
            their posts and stories.
          </Text>
        </View>
      ) : (
        <StoryHighlights
          navigation={navigation}
          user={user}
        />
      )}

      <CopyClipboardModal
        copyModalVisible={
          copyModalVisible
        }
      />

      <BottomSheetOptions
        bottomSheetRef={
          bottomSheetRefOptions
        }
        user={user}
        currentUser={currentUser}
        navigation={navigation}
        setCopyModalVisible={
          setCopyModalVisible
        }
      />
    </SafeAreaView>
  );
};

export default User;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 0,
  },

  titleContainer: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginHorizontal: 18,
    marginTop: 8,
    marginBottom: 12,
  },

  textTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  privateContainer: {
    flex: 1,
    justifyContent:
      "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingBottom: 60,
  },

  lockCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#555",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  privateTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },

  privateText: {
    color: "#888",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 7,
    maxWidth: 280,
  },
});

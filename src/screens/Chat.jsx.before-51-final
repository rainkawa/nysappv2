import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  FlatList,
  TextInput,
  Keyboard,
  Animated,
} from "react-native";
import { useEffect, useMemo, useState } from "react";
import {
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useUserContext } from "../contexts/UserContext";
import RenderUser from "../components/chat/RenderUser";
import useFindUsers from "../hooks/useFindUsers";
import { SIZES } from "../constants";
import useSlideOnKeyboard from "../utils/useSlideOnKeyboard";
import useFetchContactList from "../hooks/useFetchContactList";
import MessageModal, {
  handleFeatureNotImplemented,
} from "../components/shared/modals/MessageModal";
import {
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { SafeAreaView } from "react-native-safe-area-context";

const Chat = ({ navigation }) => {
  const [searchKey, setSearchKey] = useState("");
  const { currentUser } = useUserContext();

  const {
    chatUsers = [],
  } = useFetchContactList();

  const {
    users = [],
    searchResult = [],
  } = useFindUsers({
    currentUser,
    searchKey,
  });

  const {
    slideAnimation,
    forceSlideAnimation,
  } = useSlideOnKeyboard(
    SIZES.Width * 0.75,
    SIZES.Width * 0.9
  );

  const [inputWidth, setInputWidth] =
    useState(SIZES.Width * 0.8);

  const [focusedBar, setFocusedBar] =
    useState(false);

  const [searching, setSearching] =
    useState(false);

  const [messageModalVisible, setMessageModalVisible] =
    useState(false);

  useEffect(() => {
    const resetChatNotification = async () => {
      if (
        !currentUser?.email ||
        !(currentUser?.chat_notification > 0)
      ) {
        return;
      }

      try {
        await updateDoc(
          doc(db, "users", currentUser.email),
          {
            chat_notification: 0,
          }
        );
      } catch (error) {
        console.log(
          "Chat notification reset error:",
          error
        );
      }
    };

    resetChatNotification();
  }, [currentUser?.email]);

  const myUser = useMemo(() => {
    if (!currentUser?.email) {
      return null;
    }

    return {
      id:
        currentUser?.uid ||
        currentUser?.email,
      ...currentUser,
    };
  }, [currentUser]);

  const messageUsers = useMemo(() => {
    const result = [];

    if (myUser) {
      result.push(myUser);
    }

    const seen = new Set(
      myUser?.email
        ? [myUser.email]
        : []
    );

    for (const user of chatUsers) {
      if (!user?.email || seen.has(user.email)) {
        continue;
      }

      seen.add(user.email);
      result.push(user);
    }

    return result;
  }, [chatUsers, myUser]);

  const handleFocus = () => {
    forceSlideAnimation(true);
    setFocusedBar(true);
    setSearching(true);
    setInputWidth(
      SIZES.Width * 0.7
    );
  };

  const handleCancel = () => {
    forceSlideAnimation(false);
    setFocusedBar(false);
    setSearching(false);
    setSearchKey("");
    Keyboard.dismiss();
    setInputWidth(
      SIZES.Width * 0.8
    );
  };

  const handleCamera = () => {
    handleFeatureNotImplemented(
      setMessageModalVisible
    );
  };

  const data = searching
    ? searchKey.trim().length > 0
      ? searchResult
      : users
    : messageUsers;

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      <View style={styles.titleContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
          style={styles.rowContainer}
        >
          <MaterialIcons
            name="arrow-back-ios"
            size={24}
            color="#fff"
          />

          <Text style={styles.textTitle}>
            {currentUser?.username ||
              "Messages"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Animated.View
          style={[
            styles.searchWrapper,
            {
              width: slideAnimation,
            },
          ]}
        >
          <Ionicons
            name="search"
            size={19}
            color="#999"
            style={styles.searchIcon}
          />

          <TextInput
            value={searchKey}
            onChangeText={setSearchKey}
            maxLength={30}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Search"
            placeholderTextColor="#999"
            style={[
              styles.searchInput,
              {
                width: inputWidth,
              },
            ]}
            enterKeyHint="search"
            onFocus={handleFocus}
          />
        </Animated.View>

        {focusedBar && (
          <TouchableOpacity
            onPress={handleCancel}
          >
            <Text style={styles.cancelBtn}>
              Cancel
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.result}>
        <Text style={styles.subtitle}>
          {searching
            ? searchKey.trim().length > 0
              ? "Search result:"
              : "Suggested"
            : "Messages"}
        </Text>

        <FlatList
          data={data}
          keyExtractor={(item, index) =>
            item?.email ||
            item?.id?.toString() ||
            index.toString()
          }
          renderItem={({ item }) => (
            <RenderUser
              navigation={navigation}
              user={item}
              currentUser={currentUser}
              handleCamera={
                searching
                  ? undefined
                  : handleCamera
              }
            />
          )}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={7}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      </View>

      <MessageModal
        messageModalVisible={
          messageModalVisible
        }
        message={
          "This feature is not yet implemented."
        }
      />
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },

  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 18,
    marginTop:
      Platform.OS === "android"
        ? 8
        : 4,
  },

  textTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    marginBottom:
      Platform.OS === "android"
        ? 5
        : 1,
  },

  subtitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 4,
    marginLeft: 15,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  searchWrapper: {
    marginTop: 9,
    marginLeft: SIZES.Width * 0.04,
    backgroundColor: "#252525",
    height:
      Platform.OS === "android"
        ? 40
        : 38,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  searchIcon: {
    marginLeft: 8,
  },

  searchInput: {
    color: "#fff",
    height: "100%",
    fontSize: 15,
    marginLeft: 5,
    flex: 1,
  },

  cancelBtn: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 15,
    marginLeft: 12,
  },

  result: {
    flex: 1,
  },
});

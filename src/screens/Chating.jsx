import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  FlatList,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
} from "react-native";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";
import {
  useUserContext,
} from "../contexts/UserContext";
import RenderMessageA from "../components/chat/RenderMessageA";
import RenderMessageB from "../components/chat/RenderMessageB";
import useFetchMessages from "../hooks/useFetchMessages";
import useChatSendMessage from "../hooks/useChatSendMessage";
import {
  SafeAreaView,
} from "react-native-safe-area-context";

const Chating = ({
  navigation,
  route,
}) => {
  const {
    user,
  } = route.params || {};

  const {
    currentUser,
  } = useUserContext();

  const flatListRef =
    useRef(null);

  const {
    messages = [],
    loader: messagesLoading,
  } = useFetchMessages({
    user,
    currentUser,
  });

  const {
    chatSendMessage,
    loading: sending,
    textMessage,
    setTextMessage,
  } = useChatSendMessage({
    user,
    currentUser,
  });

  const [
    keyboardVisible,
    setKeyboardVisible,
  ] = useState(false);

  useEffect(() => {
    const show =
      Keyboard.addListener(
        Platform.OS === "ios"
          ? "keyboardWillShow"
          : "keyboardDidShow",
        () =>
          setKeyboardVisible(true)
      );

    const hide =
      Keyboard.addListener(
        Platform.OS === "ios"
          ? "keyboardWillHide"
          : "keyboardDidHide",
        () =>
          setKeyboardVisible(false)
      );

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  useEffect(() => {
    if (!messages.length) {
      return;
    }

    requestAnimationFrame(() => {
      flatListRef.current?.scrollToEnd(
        { animated: false }
      );
    });
  }, [messages.length]);

  const handleSend = async () => {
    const success =
      await chatSendMessage();

    if (success) {
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToEnd(
          { animated: true }
        );
      });
    }
  };

  if (
    !user?.email ||
    !currentUser?.email
  ) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View
          style={
            styles.invalidContainer
          }
        >
          <Text
            style={
              styles.invalidText
            }
          >
            Chat unavailable
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={[
        "top",
        "bottom",
      ]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
        keyboardVerticalOffset={
          Platform.OS === "android"
            ? 0
            : 4
        }
      >
        <View
          style={styles.header}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }
            hitSlop={8}
          >
            <MaterialIcons
              name="arrow-back-ios"
              size={21}
              color="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerUser}
            activeOpacity={0.8}
          >
            <Text
              style={
                styles.headerUsername
              }
              numberOfLines={1}
            >
              {user.username ||
                "User"}
            </Text>
          </TouchableOpacity>

          <View
            style={
              styles.headerSpacer
            }
          />
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(
            item,
            index
          ) =>
            item?.id?.toString() ||
            index.toString()
          }
          renderItem={({
            item,
          }) => {
            const isMine =
              item?.who ===
              "current";

            return isMine ? (
              <RenderMessageA
                item={item}
              />
            ) : (
              <RenderMessageB
                item={item}
              />
            );
          }}
          contentContainerStyle={[
            styles.messagesContent,
            keyboardVisible &&
              styles.messagesKeyboardOpen,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd(
              { animated: false }
            )
          }
          ListEmptyComponent={
            !messagesLoading ? (
              <View
                style={
                  styles.emptyMessages
                }
              >
                <Text
                  style={
                    styles.emptyText
                  }
                >
                  Start the conversation
                </Text>
              </View>
            ) : null
          }
        />

        <View
          style={styles.inputArea}
        >
          <View
            style={styles.inputWrapper}
          >
            <TextInput
              value={textMessage}
              onChangeText={
                setTextMessage
              }
              placeholder="Message..."
              placeholderTextColor="#777"
              style={styles.input}
              multiline
              maxLength={2000}
              textAlignVertical="center"
              blurOnSubmit={false}
            />

            <TouchableOpacity
              onPress={handleSend}
              disabled={
                sending ||
                !textMessage.trim()
              }
              style={
                styles.sendButton
              }
              hitSlop={8}
            >
              <Ionicons
                name="send"
                size={20}
                color={
                  textMessage.trim()
                    ? "#09f"
                    : "#555"
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chating;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  keyboardContainer: {
    flex: 1,
  },

  header: {
    minHeight: 48,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#171717",
  },

  headerUser: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 25,
  },

  headerUsername: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  headerSpacer: {
    width: 30,
  },

  messagesContent: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },

  messagesKeyboardOpen: {
    paddingBottom: 5,
  },

  emptyMessages: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    color: "#666",
    fontSize: 13,
  },

  inputArea: {
    borderTopWidth: 1,
    borderTopColor: "#1d1d1d",
    backgroundColor: "#000",
    paddingHorizontal: 10,
    paddingTop: 7,
    paddingBottom:
      Platform.OS === "android"
        ? 7
        : 9,
  },

  inputWrapper: {
    minHeight: 42,
    maxHeight: 115,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#444",
    flexDirection: "row",
    alignItems: "flex-end",
    paddingLeft: 12,
    paddingRight: 6,
  },

  input: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    minHeight: 40,
    maxHeight: 95,
    paddingTop: 9,
    paddingBottom: 8,
  },

  sendButton: {
    height: 38,
    width: 38,
    justifyContent: "center",
    alignItems: "center",
  },

  invalidContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  invalidText: {
    color: "#777",
    fontSize: 14,
  },
});

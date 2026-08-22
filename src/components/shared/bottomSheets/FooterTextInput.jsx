import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useState } from "react";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import useUploadComment from "../../../hooks/useUploadComment";

const FooterTextInput = ({
  post,
  currentUser,
}) => {
  const [value, setValue] = useState("");

  const {
    uploadComment,
    isLoading,
  } = useUploadComment(
    post,
    currentUser
  );

  const handleSubmitComment = async () => {
    const text = value.trim();

    if (!text || isLoading) {
      return;
    }

    const success = await uploadComment(text);

    if (success) {
      setValue("");
    }
  };

  const addEmoji = (emoji) => {
    setValue((previous) =>
      `${previous}${emoji}`
    );
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.divider} />

      <View style={styles.iconContainer}>
        <TouchableOpacity
          onPress={() => addEmoji("❤️")}
        >
          <Text style={styles.chatIcon}>❤️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => addEmoji("🙌")}
        >
          <Text style={styles.chatIcon}>🙌</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => addEmoji("🔥")}
        >
          <Text style={styles.chatIcon}>🔥</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => addEmoji("👏")}
        >
          <Text style={styles.chatIcon}>👏</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => addEmoji("😢")}
        >
          <Text style={styles.chatIcon}>😢</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => addEmoji("😍")}
        >
          <Text style={styles.chatIcon}>😍</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => addEmoji("😮")}
        >
          <Text style={styles.chatIcon}>😮</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => addEmoji("😂")}
        >
          <Text style={styles.chatIcon}>😂</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.writingContainer}>
        <Image
          source={{
            uri:
              currentUser?.profile_picture ||
              "",
          }}
          style={styles.profilePicture}
        />

        <View style={styles.inputWrapper}>
          <BottomSheetTextInput
            placeholder="Add a comment..."
            placeholderTextColor="#858585"
            style={styles.textInput}
            value={value}
            onChangeText={setValue}
            autoCapitalize="sentences"
            autoCorrect
            maxLength={255}
            multiline
            textAlignVertical="center"
          />

          {isLoading ? (
            <ActivityIndicator
              style={styles.activityIndicator}
              size="small"
            />
          ) : (
            <TouchableOpacity
              onPress={handleSubmitComment}
              disabled={!value.trim()}
              hitSlop={{
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
              }}
            >
              <Text
                style={[
                  styles.postBtn,
                  !value.trim() &&
                    styles.postBtnDisabled,
                ]}
              >
                Post
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default FooterTextInput;

const styles = StyleSheet.create({
  inputContainer: {
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom:
      Platform.OS === "android" ? 8 : 10,
    backgroundColor: "#232325",
  },

  divider: {
    height: 1,
    backgroundColor: "#333",
    marginBottom: 4,
  },

  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
    marginVertical: 7,
  },

  chatIcon: {
    fontSize:
      Platform.OS === "android" ? 24 : 26,
  },

  writingContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },

  profilePicture: {
    height: 38,
    width: 38,
    borderRadius: 50,
    marginBottom: 4,
  },

  inputWrapper: {
    flex: 1,
    minHeight: 42,
    maxHeight: 110,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#777",
    paddingLeft: 12,
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  textInput: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    lineHeight:
      Platform.OS === "android"
        ? 20
        : 19,
    maxHeight: 92,
    paddingTop: 9,
    paddingBottom: 8,
    marginRight: 6,
  },

  postBtn: {
    color: "#09f",
    fontSize: 16,
    fontWeight: "700",
    paddingHorizontal: 6,
    paddingBottom: 9,
  },

  postBtnDisabled: {
    opacity: 0.35,
  },

  activityIndicator: {
    marginHorizontal: 8,
    marginBottom: 9,
  },
});

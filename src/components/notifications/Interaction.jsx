import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const getMillis = (value) => {
  if (!value) return 0;

  if (
    typeof value?.toMillis ===
    "function"
  ) {
    return value.toMillis();
  }

  if (
    typeof value?.seconds ===
    "number"
  ) {
    return value.seconds * 1000;
  }

  if (typeof value === "number") {
    return value;
  }

  return 0;
};

const formatTime = (value) => {
  const millis = getMillis(value);

  if (!millis) return "";

  const date = new Date(millis);
  const now = new Date();

  const sameDay =
    date.getFullYear() ===
      now.getFullYear() &&
    date.getMonth() ===
      now.getMonth() &&
    date.getDate() ===
      now.getDate();

  if (sameDay) {
    return date.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  return date.toLocaleDateString(
    [],
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );
};

const Interaction = ({
  navigation,
  notification,
}) => {
  if (!notification) {
    return null;
  }

  const {
    type,
    actorEmail,
    actorUsername,
    actorProfilePicture,
    postId,
    postOwnerEmail,
    postImage,
    comment,
    createdAt,
  } = notification;

  const isComment =
    type === "comment";

  const isLike =
    type === "like";

  const time =
    formatTime(createdAt);

  const actorName =
    actorUsername ||
    "Someone";

  const handleProfile =
    () => {
      if (!actorEmail) return;

      navigation.navigate(
        "UserDetail",
        {
          email: actorEmail,
        }
      );
    };

  const handlePost =
    () => {
      if (
        !postId ||
        !postOwnerEmail
      ) {
        return;
      }

      navigation.navigate(
        "Detail",
        {
          item: {
            id: postId,
            owner_email:
              postOwnerEmail,
            imageUrl:
              postImage || "",
          },
        }
      );
    };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <TouchableOpacity
          onPress={handleProfile}
          disabled={!actorEmail}
        >
          <Image
            source={{
              uri:
                actorProfilePicture ||
                "",
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>

        <View style={styles.content}>
          <TouchableOpacity
            onPress={handleProfile}
            disabled={!actorEmail}
          >
            <Text
              numberOfLines={1}
              style={styles.username}
            >
              {actorName}
            </Text>
          </TouchableOpacity>

          <View
            style={styles.actionRow}
          >
            <View
              style={styles.actionIcon}
            >
              {isComment ? (
                <MaterialCommunityIcons
                  name="comment-outline"
                  size={16}
                  color="#fff"
                />
              ) : (
                <Ionicons
                  name="heart-outline"
                  size={16}
                  color="#fff"
                />
              )}
            </View>

            <TouchableOpacity
              onPress={handlePost}
              disabled={!postId}
              style={styles.textBlock}
            >
              <Text
                numberOfLines={1}
                style={styles.actionText}
              >
                {isComment
                  ? "Commented on your post"
                  : isLike
                  ? "Liked your post"
                  : "Interacted with your post"}
              </Text>

              {time ? (
                <Text
                  style={styles.time}
                >
                  · {time}
                </Text>
              ) : null}
            </TouchableOpacity>
          </View>

          {isComment &&
          comment ? (
            <Text
              numberOfLines={1}
              style={
                styles.commentPreview
              }
            >
              “{comment}”
            </Text>
          ) : null}
        </View>
      </View>

      <TouchableOpacity
        onPress={handlePost}
        disabled={!postId}
      >
        <Image
          source={{
            uri:
              postImage || "",
          }}
          style={styles.postImage}
          contentFit="cover"
        />
      </TouchableOpacity>
    </View>
  );
};

export default Interaction;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
    marginHorizontal: 12,
    marginTop:
      Platform.OS === "android"
        ? 12
        : 8,
    paddingVertical: 2,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#222",
  },

  content: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
    paddingRight: 8,
  },

  username: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },

  actionIcon: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },

  textBlock: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  },

  actionText: {
    color: "#ddd",
    fontSize: 12,
    flexShrink: 1,
  },

  time: {
    color: "#777",
    fontSize: 11,
    marginLeft: 4,
  },

  commentPreview: {
    color: "#777",
    fontSize: 11,
    marginTop: 3,
    maxWidth: 230,
  },

  postImage: {
    width: 48,
    height: 48,
    marginLeft: 4,
  },
});

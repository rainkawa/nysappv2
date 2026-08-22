import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import useCheckStoriesSeen from "../../hooks/useCheckStoriesSeen";
import { LinearGradient } from "expo-linear-gradient";

const getMillis = (value) => {
  if (!value) return 0;

  if (typeof value?.toMillis === "function") {
    return value.toMillis();
  }

  if (typeof value?.seconds === "number") {
    return value.seconds * 1000;
  }

  if (typeof value === "number") {
    return value;
  }

  return 0;
};

const formatTime = (value) => {
  const millis = getMillis(value);

  if (!millis) {
    return "";
  }

  const date = new Date(millis);
  const now = new Date();

  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (sameDay) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString([], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const Interaction = ({
  navigation,
  notification,
  currentUser,
}) => {
  const {
    checkStoriesSeen,
  } = useCheckStoriesSeen();

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

  const isComment = type === "comment";
  const actorName =
    actorUsername || "Someone";

  const time = formatTime(createdAt);

  const handleUserProfile = () => {
    if (!actorEmail) {
      return;
    }

    navigation.navigate("UserDetail", {
      email: actorEmail,
    });
  };

  const handleCheckPost = () => {
    if (!postId || !postOwnerEmail) {
      return;
    }

    navigation.navigate("Detail", {
      item: {
        id: postId,
        owner_email: postOwnerEmail,
        imageUrl: postImage || "",
      },
    });
  };

  const seenStory =
    actorEmail && currentUser?.email
      ? checkStoriesSeen(
          actorEmail,
          currentUser.email
        )
      : false;

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <TouchableOpacity
          onPress={handleUserProfile}
          disabled={!actorEmail}
        >
          {seenStory ? (
            <LinearGradient
              start={[0.9, 0.45]}
              end={[0.07, 1.03]}
              colors={[
                "#ff00ff",
                "#ff4400",
                "#ffff00",
              ]}
              style={styles.rainbowBorder}
            >
              <Image
                source={{
                  uri: actorProfilePicture || "",
                }}
                style={styles.image}
              />
            </LinearGradient>
          ) : (
            <Image
              source={{
                uri: actorProfilePicture || "",
              }}
              style={styles.nonRainbowImage}
            />
          )}
        </TouchableOpacity>

        <View style={styles.userContainer}>
          <TouchableOpacity
            onPress={handleUserProfile}
            disabled={!actorEmail}
          >
            <Text style={styles.username}>
              {actorName}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCheckPost}
            disabled={!postId}
          >
            <View style={styles.messageRow}>
              <Text style={styles.name}>
                {isComment
                  ? "Commented your post."
                  : "Liked your post."}
              </Text>

              {time ? (
                <Text style={styles.time}>
                  {" "}
                  · {time}
                </Text>
              ) : null}
            </View>

            {isComment && comment ? (
              <Text
                numberOfLines={1}
                style={styles.commentPreview}
              >
                “{comment}”
              </Text>
            ) : null}
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleCheckPost}
        disabled={!postId}
      >
        <Image
          source={{
            uri: postImage || "",
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
    justifyContent: "space-between",
    marginHorizontal: 12,
    marginTop:
      Platform.OS === "android" ? 15 : 8,
  },

  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  rainbowBorder: {
    borderRadius: 100,
    height: 58,
    width: 58,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    height: 56,
    width: 56,
    borderRadius: 100,
    borderWidth: 2.5,
    borderColor: "#000",
  },

  nonRainbowImage: {
    height: 58,
    width: 58,
    borderWidth: 3,
    borderColor: "#000",
    borderRadius: 100,
  },

  userContainer: {
    justifyContent: "center",
    marginLeft: 15,
    flex: 1,
    paddingRight: 8,
  },

  username: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  messageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },

  name: {
    color: "#ddd",
    fontSize: 13,
    fontWeight: "400",
  },

  time: {
    color: "#888",
    fontSize: 12,
  },

  commentPreview: {
    color: "#777",
    fontSize: 12,
    marginTop: 2,
    maxWidth: 210,
  },

  postImage: {
    height: 60,
    width: 60,
    marginRight: 2,
  },
});

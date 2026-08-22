import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import Requests from "../components/follow/Requests";
import Interaction from "../components/notifications/Interaction";
import useFetchRequests from "../hooks/useFetchRequests";
import useFetchUserPosts from "../hooks/useFetchUserPosts";
import { LinearGradient } from "expo-linear-gradient";
import { SIZES } from "../constants";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { SafeAreaView } from "react-native-safe-area-context";

const Notifications = ({ navigation, route }) => {
  const currentUser = route?.params?.currentUser;

  const { posts = [] } = useFetchUserPosts(currentUser?.email);
  const { requests = [] } = useFetchRequests({
    user: currentUser,
  });

  const [notificationCounter, setNotificationCounter] = useState(0);

  useEffect(() => {
    if (!currentUser?.email) return;

    const resetEventNotification = async () => {
      if ((currentUser?.event_notification ?? 0) > 0) {
        try {
          await updateDoc(doc(db, "users", currentUser.email), {
            event_notification: 0,
          });
        } catch (error) {
          console.log("Notification reset error:", error);
        }
      }
    };

    resetEventNotification();
  }, [currentUser?.email]);

  useEffect(() => {
    if (!currentUser?.email) return;

    let counter = 0;

    for (const post of posts) {
      if (!post || post.id === "empty") continue;

      const comments = Array.isArray(post.comments)
        ? post.comments
        : [];

      const newLikes = Array.isArray(post.new_likes)
        ? post.new_likes
        : [];

      if (comments.length > 0) {
        const lastComment = comments[comments.length - 1];

        if (lastComment?.email !== currentUser.email) {
          counter++;
        }
      }

      if (newLikes.length > 0) {
        counter++;
      }
    }

    const followerRequests = Array.isArray(currentUser.followers_request)
      ? currentUser.followers_request
      : [];

    counter += followerRequests.length;

    setNotificationCounter(counter);
  }, [posts, currentUser]);

  const validPosts = posts.filter(
    (post) => post && post.id !== "empty"
  );

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.footerContainer}>
          <Text style={styles.title}>User information unavailable</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.button}>Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.titleContainer}
      >
        <MaterialIcons
          name="arrow-back-ios"
          size={22}
          color="#fff"
        />
        <Text style={styles.textTitle}>Notifications</Text>
      </TouchableOpacity>

      {notificationCounter > 0 ? (
        <View style={{ flex: 1 }}>
          {Array.isArray(currentUser.followers_request) &&
            currentUser.followers_request.length > 0 && (
              <View>
                <Text style={styles.subtitle}>
                  Followers Requests:
                </Text>

                <FlatList
                  data={requests}
                  keyExtractor={(item, index) =>
                    item?.email || index.toString()
                  }
                  renderItem={({ item }) => (
                    <Requests user={item} />
                  )}
                />
              </View>
            )}

          <FlatList
            data={validPosts}
            keyExtractor={(item, index) =>
              item?.id || index.toString()
            }
            renderItem={({ item }) => {
              const comments = Array.isArray(item.comments)
                ? item.comments
                : [];

              const newLikes = Array.isArray(item.new_likes)
                ? item.new_likes
                : [];

              if (
                comments.length > 0 &&
                comments[comments.length - 1]?.username !==
                  currentUser.username
              ) {
                return (
                  <Interaction
                    navigation={navigation}
                    item={{
                      ...item,
                      comments,
                      new_likes: newLikes,
                    }}
                    currentUser={currentUser}
                    text="commented"
                  />
                );
              }

              if (newLikes.length > 0) {
                return (
                  <Interaction
                    navigation={navigation}
                    item={{
                      ...item,
                      comments,
                      new_likes: newLikes,
                    }}
                    currentUser={currentUser}
                    text="liked"
                  />
                );
              }

              return null;
            }}
          />
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <LinearGradient
            start={[0.9, 0.45]}
            end={[0.07, 1.03]}
            colors={["#ff00ff", "#ff4400", "#ffff00"]}
            style={styles.rainbowBorder}
          >
            <AntDesign
              name="checkcircle"
              size={58}
              color="#000"
            />
          </LinearGradient>

          <Text style={styles.title}>
            No notifications for now
          </Text>

          <Text style={styles.text}>
            There are no notifications from the past 30 days.
          </Text>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.button}>
              Back to home
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 0,
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: Platform.OS === "android" ? 20 : 4,
    gap: 3,
  },

  textTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
    transform: [{ scaleY: 1.1 }],
  },

  subtitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
    marginHorizontal: 20,
  },

  footerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: SIZES.Height * 0.18,
    gap: 10,
  },

  rainbowBorder: {
    padding: 3,
    height: 63.5,
    width: 63.5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },

  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  text: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },

  button: {
    color: "#09f",
    fontSize: 16,
    fontWeight: "700",
  },
});

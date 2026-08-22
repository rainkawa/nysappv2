import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { useState } from "react";
import useHandleFollow from "../../hooks/useHandleFollow";
import RemoveFollower from "./RemoveFollower";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import useCheckStoriesSeen from "../../hooks/useCheckStoriesSeen";
import { SIZES } from "../../constants";

const Followers = ({ user, currentUser, navigation }) => {
  const {
    checkStoriesSeen,
  } = useCheckStoriesSeen();

  const { handleFollow } = useHandleFollow({
    user,
  });

  const [modalVisible, setModalVisible] = useState(false);

  if (!user?.email || !currentUser?.email) {
    return null;
  }

  const following = Array.isArray(currentUser.following)
    ? currentUser.following
    : [];

  const followingRequest = Array.isArray(
    currentUser.following_request
  )
    ? currentUser.following_request
    : [];

  const isFollowing = following.includes(user.email);
  const isRequested = followingRequest.includes(
    user.email
  );

  const handleModal = () => {
    setModalVisible((previous) => !previous);
  };

  const handleViewProfile = () => {
    navigation.navigate("UserDetail", {
      email: user.email,
    });
  };

  const handleFollowPress = () => {
    if (!isFollowing && !isRequested) {
      handleFollow(user.email);
    }
  };

  const storySeen = checkStoriesSeen(
    user.username,
    currentUser.email
  );

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={handleViewProfile}
      >
        <View style={styles.rowContainer}>
          {storySeen ? (
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
                  uri: user.profile_picture || "",
                }}
                style={styles.image}
              />
            </LinearGradient>
          ) : (
            <Image
              source={{
                uri: user.profile_picture || "",
              }}
              style={styles.nonRainbowImage}
            />
          )}

          <View style={styles.userContainer}>
            <View style={styles.innerRow}>
              <Text
                numberOfLines={1}
                style={styles.username}
              >
                {user.username || "Unknown user"}
              </Text>

              {!isFollowing && (
                <TouchableOpacity
                  onPress={handleFollowPress}
                  disabled={isRequested}
                >
                  <Text
                    style={
                      isRequested
                        ? styles.buttonTextRequested
                        : styles.buttonTextFollow
                    }
                  >
                    {isRequested
                      ? " • Requested"
                      : " • Follow"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.name}>
              {user.name || ""}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>

      <TouchableOpacity onPress={handleModal}>
        <View style={styles.button}>
          <Text style={styles.removeText}>
            Remove
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={handleModal}
      >
        <RemoveFollower
          user={user}
          handleModal={handleModal}
        />
      </Modal>
    </View>
  );
};

export default Followers;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 12,
    marginTop: 15,
  },

  rowContainer: {
    flexDirection: "row",
    flex: 1,
  },

  innerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  rainbowBorder: {
    borderRadius: 100,
    height: 64,
    width: 64,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    height: 60,
    width: 60,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#000",
  },

  nonRainbowImage: {
    height: 64,
    width: 64,
    borderWidth: 3,
    borderColor: "#000",
    borderRadius: 100,
  },

  userContainer: {
    justifyContent: "center",
    flex: 1,
  },

  username: {
    marginLeft: 12,
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    maxWidth: SIZES.Width * 0.29,
  },

  name: {
    marginTop: 2,
    marginLeft: 12,
    color: "#999",
    fontSize: 13,
    fontWeight: "400",
    width: SIZES.Width * 0.45,
    marginBottom: 4,
  },

  button: {
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    height:
      Platform.OS === "android" ? 36 : 32,
    width: 90,
    borderRadius: 10,
  },

  buttonTextFollow: {
    color: "#08f",
    fontWeight: "700",
    fontSize: 13,
    marginBottom:
      Platform.OS === "android" ? -3 : 0,
  },

  buttonTextRequested: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
    marginBottom:
      Platform.OS === "android" ? -3 : 0,
  },

  removeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
    marginBottom:
      Platform.OS === "android" ? 4 : 0,
  },
});

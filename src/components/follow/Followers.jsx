import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Platform,
} from "react-native";
import { useState } from "react";
import useHandleFollow from "../../hooks/useHandleFollow";
import RemoveFollower from "./RemoveFollower";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import useCheckStoriesSeen from "../../hooks/useCheckStoriesSeen";

const Followers = ({
  user,
  currentUser,
  navigation,
}) => {
  const {
    checkStoriesSeen,
  } = useCheckStoriesSeen();

  const {
    handleFollow,
  } = useHandleFollow();

  const [
    modalVisible,
    setModalVisible,
  ] = useState(false);

  if (
    !user?.email ||
    !currentUser?.email
  ) {
    return null;
  }

  const following =
    Array.isArray(
      currentUser.following
    )
      ? currentUser.following
      : [];

  const followingRequest =
    Array.isArray(
      currentUser.following_request
    )
      ? currentUser.following_request
      : [];

  const isSelf =
    currentUser.email === user.email;

  const isFollowing =
    following.includes(user.email);

  const isRequested =
    followingRequest.includes(
      user.email
    );

  const handleModal = () => {
    setModalVisible(
      (previous) => !previous
    );
  };

  const handleViewProfile = () => {
    if (isSelf) {
      navigation.navigate("Profile");
      return;
    }

    navigation.navigate(
      "UserDetail",
      {
        email: user.email,
      }
    );
  };

  const handleFollowPress = () => {
    if (
      isSelf ||
      isFollowing
    ) {
      return;
    }

    handleFollow(user.email);
  };

  const storySeen =
    checkStoriesSeen(
      user.username,
      currentUser.email
    );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleViewProfile}
        style={styles.rowContainer}
        activeOpacity={0.8}
      >
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
                uri:
                  user.profile_picture ||
                  "",
              }}
              style={styles.image}
            />
          </LinearGradient>
        ) : (
          <Image
            source={{
              uri:
                user.profile_picture ||
                "",
            }}
            style={styles.nonRainbowImage}
          />
        )}

        <View style={styles.userContainer}>
          <Text
            numberOfLines={1}
            style={styles.username}
          >
            {user.username ||
              "Unknown user"}
          </Text>

          <Text
            numberOfLines={1}
            style={styles.name}
          >
            {user.name || ""}
          </Text>
        </View>
      </TouchableOpacity>

      {!isSelf &&
        (isFollowing ? (
          <TouchableOpacity
            onPress={handleModal}
          >
            <View style={styles.button}>
              <Text style={styles.buttonText}>
                Following
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleFollowPress}
          >
            <View
              style={
                isRequested
                  ? styles.button
                  : styles.blueButton
              }
            >
              <Text style={styles.buttonText}>
                {isRequested
                  ? "Requested"
                  : user?.isPrivate === true
                  ? "Request"
                  : "Follow"}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

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
    justifyContent:
      "space-between",
    marginHorizontal: 12,
    marginTop: 10,
  },

  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  rainbowBorder: {
    borderRadius: 100,
    height: 52,
    width: 52,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    height: 49,
    width: 49,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#000",
  },

  nonRainbowImage: {
    height: 52,
    width: 52,
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 100,
  },

  userContainer: {
    justifyContent: "center",
    flex: 1,
  },

  username: {
    marginLeft: 10,
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },

  name: {
    marginTop: 2,
    marginLeft: 10,
    color: "#888",
    fontSize: 12,
  },

  button: {
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    height:
      Platform.OS === "android"
        ? 32
        : 30,
    width: 88,
    borderRadius: 9,
  },

  blueButton: {
    backgroundColor: "#08f",
    justifyContent: "center",
    alignItems: "center",
    height:
      Platform.OS === "android"
        ? 32
        : 30,
    width: 82,
    borderRadius: 9,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
});

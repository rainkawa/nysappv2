import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { useState } from "react";
import useHandleFollow from "../../hooks/useHandleFollow";
import Unfollow from "../follow/Unfollow";

const SubHeader = ({
  user,
  currentUser,
  navigation,
}) => {
  const {
    handleFollow,
  } = useHandleFollow();

  const [
    unfollowVisible,
    setUnfollowVisible,
  ] = useState(false);

  const followers =
    Array.isArray(user?.followers)
      ? user.followers
      : [];

  const following =
    Array.isArray(user?.following)
      ? user.following
      : [];

  const requests =
    Array.isArray(
      currentUser?.following_request
    )
      ? currentUser.following_request
      : [];

  const isSelf =
    currentUser?.email === user?.email;

  const isFollowing =
    !isSelf &&
    followers.includes(
      currentUser?.email
    );

  const isRequested =
    !isSelf &&
    requests.includes(
      user?.email
    );

  const handleFollowAction =
    async () => {
      if (
        isSelf ||
        !user?.email
      ) {
        return;
      }

      if (isFollowing) {
        setUnfollowVisible(true);
        return;
      }

      await handleFollow(
        user.email
      );
    };

  const handleFollowers = () => {
    navigation.navigate(
      "UserFollow",
      {
        user,
        type: "Followers",
      }
    );
  };

  const handleFollowing = () => {
    navigation.navigate(
      "UserFollow",
      {
        user,
        type: "Following",
      }
    );
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Image
            source={{
              uri:
                user?.profile_picture ||
                "",
            }}
            style={styles.profileImage}
          />

          <View style={styles.stats}>
            <TouchableOpacity
              style={styles.stat}
              onPress={handleFollowers}
            >
              <Text style={styles.statNumber}>
                {followers.length}
              </Text>

              <Text style={styles.statLabel}>
                Followers
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.stat}
              onPress={handleFollowing}
            >
              <Text style={styles.statNumber}>
                {following.length}
              </Text>

              <Text style={styles.statLabel}>
                Following
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.info}>
          <Text
            style={styles.name}
            numberOfLines={1}
          >
            {user?.name || ""}
          </Text>

          {!!user?.bio && (
            <Text style={styles.bio}>
              {user.bio}
            </Text>
          )}

          {!!user?.link && (
            <Text
              style={styles.link}
              numberOfLines={1}
            >
              {user.link}
            </Text>
          )}
        </View>

        {!isSelf && (
          <TouchableOpacity
            onPress={
              handleFollowAction
            }
            activeOpacity={0.8}
            style={
              isFollowing ||
              isRequested
                ? styles.actionButton
                : styles.followButton
            }
          >
            <Text
              style={styles.actionText}
            >
              {isFollowing
                ? "Following"
                : isRequested
                ? "Cancel request"
                : user?.isPrivate === true
                ? "Request"
                : "Follow"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {user?.email && (
        <Unfollow
          user={user}
          visible={unfollowVisible}
          handleModal={() =>
            setUnfollowVisible(false)
          }
        />
      )}
    </>
  );
};

export default SubHeader;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingTop: 6,
    paddingBottom: 8,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  profileImage: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#222",
  },

  stats: {
    flexDirection: "row",
    flex: 1,
    justifyContent:
      "space-evenly",
    marginLeft: 10,
  },

  stat: {
    alignItems: "center",
    minWidth: 75,
  },

  statNumber: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },

  statLabel: {
    color: "#999",
    fontSize: 12,
    marginTop: 2,
  },

  info: {
    marginTop: 7,
  },

  name: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },

  bio: {
    color: "#ddd",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3,
  },

  link: {
    color: "#4aa8ff",
    fontSize: 13,
    marginTop: 3,
  },

  followButton: {
    height: 34,
    marginTop: 10,
    borderRadius: 9,
    backgroundColor: "#08f",
    justifyContent: "center",
    alignItems: "center",
  },

  actionButton: {
    height: 34,
    marginTop: 10,
    borderRadius: 9,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },

  actionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
});

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { useMemo } from "react";

const SubHeader = ({
  user,
  currentUser,
  navigation,
}) => {
  const followers = Array.isArray(
    user?.followers
  )
    ? user.followers
    : [];

  const following = Array.isArray(
    user?.following
  )
    ? user.following
    : [];

  const isSelf =
    currentUser?.email === user?.email;

  const followersCount =
    followers.length;

  const followingCount =
    following.length;

  const privacyLabel = useMemo(
    () =>
      user?.isPrivate === true
        ? "Private account"
        : "",
    [user?.isPrivate]
  );

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
              {followersCount}
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
              {followingCount}
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

        {!isSelf &&
          privacyLabel ? (
          <Text style={styles.privateText}>
            {privacyLabel}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export default SubHeader;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingTop: 6,
    paddingBottom: 6,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  profileImage: {
    width: 82,
    height: 82,
    borderRadius: 41,
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

  privateText: {
    color: "#888",
    fontSize: 12,
    marginTop: 4,
  },
});

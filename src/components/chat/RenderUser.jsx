import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import {
  Image,
} from "expo-image";

const RenderUser = ({
  navigation,
  user,
  currentUser,
  handleCamera,
}) => {
  if (
    !user?.email ||
    user.email ===
      currentUser?.email
  ) {
    return null;
  }

  const handleOpenChat = () => {
    navigation.navigate(
      "Chating",
      {
        user,
      }
    );
  };

  return (
    <TouchableOpacity
      onPress={
        handleOpenChat
      }
      activeOpacity={0.8}
      style={styles.container}
    >
      <Image
        source={{
          uri:
            user?.profile_picture ||
            "",
        }}
        style={styles.image}
      />

      <View
        style={
          styles.userContainer
        }
      >
        <Text
          numberOfLines={1}
          style={styles.username}
        >
          {user?.username ||
            "Unknown user"}
        </Text>

        <Text
          numberOfLines={1}
          style={styles.name}
        >
          {user?.name || ""}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default RenderUser;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
  },

  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#222",
  },

  userContainer: {
    flex: 1,
    marginLeft: 11,
  },

  username: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },

  name: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },
});

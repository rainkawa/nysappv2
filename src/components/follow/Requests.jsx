import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import {
  useUserContext,
} from "../../contexts/UserContext";
import useHandleRequests from "../../hooks/useHandleRequests";
import { Image } from "expo-image";
import { SIZES } from "../../constants";
import {
  Ionicons,
} from "@expo/vector-icons";

const Requests = ({
  user,
  navigation,
}) => {
  const {
    currentUser,
  } = useUserContext();

  const {
    handleRequests,
  } = useHandleRequests({
    currentUser,
    user,
  });

  const handleViewProfile = () => {
    if (!user?.email) return;

    navigation.navigate(
      "UserDetail",
      {
        email: user.email,
      }
    );
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={
          handleViewProfile
        }
        style={styles.userPressable}
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
          style={styles.userContainer}
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
      </Pressable>

      <View
        style={styles.actions}
      >
        <TouchableOpacity
          onPress={() =>
            handleRequests(true)
          }
          style={styles.acceptButton}
          activeOpacity={0.8}
        >
          <Ionicons
            name="checkmark"
            size={17}
            color="#fff"
          />

          <Text
            style={styles.buttonText}
          >
            Accept
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            handleRequests(false)
          }
          style={styles.removeButton}
          activeOpacity={0.8}
        >
          <Ionicons
            name="close"
            size={17}
            color="#fff"
          />

          <Text
            style={styles.buttonText}
          >
            Remove
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Requests;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
    marginHorizontal: 12,
    marginTop: 12,
    paddingVertical: 2,
  },

  userPressable: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  },

  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#222",
  },

  userContainer: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
    maxWidth:
      SIZES.Width * 0.42,
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

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  acceptButton: {
    height: 32,
    minWidth: 72,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#07f",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
  },

  removeButton: {
    height: 32,
    minWidth: 72,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#333",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
  },

  buttonText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
});

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import Animated, { FadeIn, ZoomInDown } from "react-native-reanimated";
import { SIZES } from "../constants";
import {
  MaterialIcons,
  Ionicons,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useUserContext } from "../contexts/UserContext";
import useUploadStory from "../hooks/useUploadStory";
import useResizePictures from "../hooks/useResizePictures";
import { Image } from "expo-image";
import MessageModal, {
  handleFeatureNotImplemented,
} from "../components/shared/modals/MessageModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NewStory = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { selectedImage } = route.params || {};
  const { uploadStory, isLoading } = useUploadStory();
  const { resizeStoryPicture } = useResizePictures();
  const { currentUser } = useUserContext();

  const [opacity, setOpacity] = useState(0);
  const [messageModalVisible, setMessageModalVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(1);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmitButton = async () => {
    if (isLoading) return;

    if (!selectedImage?.uri) {
      console.log("Story upload cancelled: no image selected.");
      return;
    }

    if (!currentUser?.email) {
      console.log("Story upload cancelled: current user unavailable.");
      return;
    }

    try {
      const resizedImage = await resizeStoryPicture(selectedImage.uri);

      if (!resizedImage?.uri) {
        throw new Error("Story image resize failed.");
      }

      const success = await uploadStory(resizedImage.uri, currentUser);

      if (!success) {
        return;
      }

      navigation.navigate("Main Screen");
    } catch (error) {
      console.error("Story publish error:", error);
    }
  };

  return (
    <View style={[styles.container, { opacity }]}>
      <View style={styles.imageContainer}>
        <Animated.View
          style={styles.topButtonsContainer}
          entering={ZoomInDown.duration(550)}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButtonContainer}
            disabled={isLoading}
          >
            <MaterialIcons
              name="arrow-back-ios"
              size={24}
              color={"#fff"}
              style={styles.buttonIcon}
            />
          </TouchableOpacity>

          <View style={styles.modButtonsContainer}>
            <TouchableOpacity
              onPress={() =>
                handleFeatureNotImplemented(setMessageModalVisible)
              }
              style={styles.modButtonContainer}
              disabled={isLoading}
            >
              <Feather name="volume-2" size={28} color={"#fff"} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                handleFeatureNotImplemented(setMessageModalVisible)
              }
              style={styles.modButtonContainer}
              disabled={isLoading}
            >
              <Text style={styles.modButtonText}>Aa</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                handleFeatureNotImplemented(setMessageModalVisible)
              }
              style={styles.modButtonContainer}
              disabled={isLoading}
            >
              <MaterialCommunityIcons
                name="sticker-emoji"
                size={27}
                color={"#fff"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                handleFeatureNotImplemented(setMessageModalVisible)
              }
              style={styles.modButtonContainer}
              disabled={isLoading}
            >
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={27}
                color={"#fff"}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Image source={{ uri: selectedImage?.uri }} style={styles.image} />
      </View>

      <Animated.View
        style={styles.bottomButtonsContainer}
        entering={FadeIn.duration(1000)}
      >
        <TouchableOpacity
          onPress={handleSubmitButton}
          disabled={isLoading}
          style={[
            styles.userContainer,
            isLoading && styles.disabledButton,
          ]}
        >
          <Image
            source={{ uri: currentUser?.profile_picture }}
            style={styles.userImage}
          />
          <Text style={styles.userText}>Your story</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSubmitButton}
          disabled={isLoading}
          style={[
            styles.userContainer,
            isLoading && styles.disabledButton,
          ]}
        >
          <View style={styles.iconBorder}>
            <MaterialIcons name="stars" size={23} color={"#3b3"} />
          </View>
          <Text style={styles.userText}>Close Friends</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSubmitButton}
          disabled={isLoading}
          style={styles.nextButtonContainer}
        >
          {isLoading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Ionicons name="arrow-forward" size={30} color={"#000"} />
          )}
        </TouchableOpacity>
      </Animated.View>

      <MessageModal
        messageModalVisible={messageModalVisible}
        message={"This feature is not yet implemented."}
        height={80}
      />

      <View style={{ height: insets.bottom }} />
    </View>
  );
};

export default NewStory;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "ios" ? 54 : 54,
    backgroundColor: "#000",
    flex: 1,
  },

  imageContainer: {
    flex: 1,
  },

  topButtonsContainer: {
    zIndex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    position: "relative",
    marginTop: -50,
    top: 56,
    marginHorizontal: 12,
  },

  modButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  modButtonContainer: {
    height: 44,
    width: 44,
    borderRadius: 100,
    backgroundColor: "#484040",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.92,
  },

  modButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 8,
    transform: [{ scaleY: 1.1 }],
  },

  image: {
    width: SIZES.Width,
    height:
      Platform.OS === "android"
        ? SIZES.Height * 0.925
        : SIZES.Height * 0.85,
    borderRadius: 25,
  },

  backButtonContainer: {
    height: 45,
    width: 45,
    borderRadius: 100,
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#444040",
    opacity: 0.99,
  },

  buttonIcon: {
    paddingLeft: 10,
  },

  bottomButtonsContainer: {
    height: SIZES.Height * 0.08,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },

  userContainer: {
    flex: 1,
    height: 44,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: 30,
    paddingHorizontal: 10,
    backgroundColor: "#333",
  },

  disabledButton: {
    opacity: 0.55,
  },

  userImage: {
    height: 26,
    width: 26,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#fff",
  },

  userText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
    marginBottom: Platform.OS === "android" ? 4 : 0,
  },

  nextButtonContainer: {
    backgroundColor: "#fff",
    height: 45,
    width: 45,
    borderRadius: 100,
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  iconBorder: {
    backgroundColor: "#fff",
    borderRadius: 100,
  },
});

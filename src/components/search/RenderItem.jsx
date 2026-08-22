import {
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { SIZES } from "../../constants";

const RenderItem = ({ navigation, item }) => {
  if (!item?.imageUrl) {
    return <View style={styles.emptyItem} />;
  }

  const handlePress = () => {
    if (!item?.id || !item?.owner_email) {
      console.log("Post detail unavailable:", item);
      return;
    }

    navigation.navigate("Detail", {
      item,
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={styles.imagesContainer}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
        contentFit="cover"
      />
    </TouchableOpacity>
  );
};

export default RenderItem;

const styles = StyleSheet.create({
  imagesContainer: {
    width: SIZES.Width * 0.335,
    height: SIZES.Width * 0.335,
    margin: -0.4,
  },

  image: {
    width: "100%",
    height: "100%",
    borderWidth: 1,
    borderColor: "#111",
  },

  emptyItem: {
    width: SIZES.Width * 0.335,
    height: SIZES.Width * 0.335,
    margin: -0.4,
    backgroundColor: "#111",
  },
});

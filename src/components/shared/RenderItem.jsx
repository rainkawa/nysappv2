import {
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Image,
} from "expo-image";
import { useRef } from "react";

const RenderItem = ({
  item,
  navigation,
}) => {
  const opening =
    useRef(false);

  const openDetail = () => {
    if (
      opening.current ||
      !item?.id
    ) {
      return;
    }

    opening.current = true;

    navigation.navigate(
      "Detail",
      {
        item,
      }
    );

    setTimeout(() => {
      opening.current = false;
    }, 450);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={openDetail}
      style={styles.container}
    >
      <Image
        source={{
          uri:
            item?.imageUrl ||
            "",
        }}
        style={styles.image}
        contentFit="cover"
      />

      <View
        pointerEvents="none"
        style={styles.overlay}
      />
    </TouchableOpacity>
  );
};

export default RenderItem;

const styles = StyleSheet.create({
  container: {
    width: "33.333%",
    aspectRatio: 1,
    overflow: "hidden",
    backgroundColor: "#111",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});

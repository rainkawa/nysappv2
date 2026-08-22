import { StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useEffect, useRef, useState } from "react";
import TitleBar from "../components/shared/TitleBar";
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import { useUserContext } from "../contexts/UserContext";
import BottomSheetOptions from "../components/detail/bottomSheets/BottomSheetOptions";
import BottomSheetComments from "../components/detail/bottomSheets/BottomSheetComments";
import BottomSheetComment from "../components/detail/bottomSheets/BottomSheetComment";
import useFetchUserPosts from "../hooks/useFetchUserPosts";
import RenderItem from "../components/detail/RenderItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Detail = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const initialItem = route?.params?.item || null;
  const { currentUser } = useUserContext();

  const {
    timeToReplaceData,
    onSnapshotData,
  } = useFetchUserPosts(
    initialItem?.owner_email
  );

  const [bottomSheetIndex, setBottomSheetIndex] =
    useState(0);
  const [layoutHeight, setLayoutHeight] =
    useState(0);

  const bottomSheetRefOptions = useRef(null);
  const bottomSheetRefComments = useRef(null);
  const bottomSheetRefComment = useRef(null);

  const [posts, setPosts] = useState(
    initialItem ? [initialItem] : []
  );

  useEffect(() => {
    if (
      !initialItem?.id ||
      !Array.isArray(onSnapshotData) ||
      timeToReplaceData <= 0
    ) {
      return;
    }

    const snapshotPosts = [...onSnapshotData];

    const index = snapshotPosts.findIndex(
      (post) => post?.id === initialItem.id
    );

    if (index === -1) {
      setPosts([initialItem]);
      return;
    }

    const [selectedPost] =
      snapshotPosts.splice(index, 1);

    setPosts([
      selectedPost,
      ...snapshotPosts,
    ]);

    setBottomSheetIndex(0);
  }, [
    initialItem,
    onSnapshotData,
    timeToReplaceData,
  ]);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value =
        event.translationX * 0.8;
      translateY.value =
        event.translationY * 0.8;

      const distance = Math.sqrt(
        event.translationX *
          event.translationX +
          event.translationY *
            event.translationY
      );

      const scaleValue = Math.max(
        0.9,
        Math.min(
          1,
          1 - distance / 1000
        )
      );

      scale.value = scaleValue;
    })
    .onEnd(() => {
      if (translateY.value > 75) {
        opacity.value = withTiming(
          0,
          { duration: 120 },
          () => {
            runOnJS(navigation.goBack)();
          }
        );

        return;
      }

      translateX.value = withTiming(0, {
        duration: 300,
      });

      translateY.value = withTiming(0, {
        duration: 300,
      });

      scale.value = withTiming(1, {
        duration: 300,
      });
    });

  const animatedStyle =
    useAnimatedStyle(() => ({
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
        {
          scale: scale.value,
        },
      ],

      backgroundColor: interpolateColor(
        opacity.value,
        [0, 1],
        ["transparent", "#000"]
      ),

      borderRadius: 20,
      overflow: "hidden",
    }));

  if (!initialItem) {
    return (
      <View style={styles.container}>
        <TitleBar
          navigation={navigation}
          name="Detail"
          activity={false}
        />
      </View>
    );
  }

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.container,
          animatedStyle,
        ]}
      >
        <TitleBar
          navigation={navigation}
          name="Detail"
          activity={false}
        />

        <FlatList
          data={posts}
          snapToInterval={
            layoutHeight > 0
              ? layoutHeight - 10
              : undefined
          }
          snapToAlignment="start"
          decelerationRate="fast"
          renderItem={({ item, index }) => (
            <RenderItem
              navigation={navigation}
              post={item}
              currentUser={currentUser}
              bottomSheetRefComments={
                bottomSheetRefComments
              }
              bottomSheetRefComment={
                bottomSheetRefComment
              }
              bottomSheetRefOptions={
                bottomSheetRefOptions
              }
              setBottomSheetIndex={
                setBottomSheetIndex
              }
              sharedIndex={index}
              setLayoutHeight={
                setLayoutHeight
              }
            />
          )}
          ListFooterComponent={
            <View style={{ height: 100 }} />
          }
          keyExtractor={(item, index) =>
            item?.id?.toString() ||
            index.toString()
          }
          showsVerticalScrollIndicator={false}
        />

        <View
          style={{
            height: insets.bottom,
          }}
        />

        {posts[bottomSheetIndex] && (
          <>
            <BottomSheetOptions
              bottomSheetRef={
                bottomSheetRefOptions
              }
              navigation={navigation}
              post={
                posts[bottomSheetIndex]
              }
              currentUser={currentUser}
            />

            <BottomSheetComments
              bottomSheetRef={
                bottomSheetRefComments
              }
              post={
                posts[bottomSheetIndex]
              }
              currentUser={currentUser}
              navigation={navigation}
            />

            <BottomSheetComment
              bottomSheetRefComment={
                bottomSheetRefComment
              }
              post={
                posts[bottomSheetIndex]
              }
              currentUser={currentUser}
            />
          </>
        )}
      </Animated.View>
    </GestureDetector>
  );
};

export default Detail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 44,
  },
});

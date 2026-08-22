import {
  StyleSheet,
  Animated,
  FlatList,
  View,
  RefreshControl,
} from "react-native";
import { useState } from "react";
import { useUserContext } from "../contexts/UserContext";
import useHeaderScrollAnim from "../utils/useHeaderScrollAnim";
import useFetchPosts from "../hooks/useFetchPosts";
import Header from "../components/home/Header";
import Stories from "../components/home/Stories";
import Posts from "../components/home/Posts";
import PostsSkeleton from "../components/home/skeletons/PostsSkeleton";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = ({ navigation }) => {
  const { currentUser } = useUserContext();

  const {
    headerTranslate,
    headerOpacity,
    scrollY,
  } = useHeaderScrollAnim(52);

  const {
    posts = [],
    isLoading,
    fetchOlderPosts,
    refreshPosts,
  } = useFetchPosts();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (refreshing) return;

    setRefreshing(true);

    try {
      if (typeof refreshPosts === "function") {
        await refreshPosts();
      }
    } finally {
      setRefreshing(false);
    }
  };

  const renderPostItem = ({ item }) => (
    <Posts
      navigation={navigation}
      post={item}
      currentUser={currentUser}
    />
  );

  const renderHeaderComponent = () => (
    <Stories
      navigation={navigation}
      currentUser={currentUser}
    />
  );

  const handleScroll = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: {
            y: scrollY,
          },
        },
      },
    ],
    {
      useNativeDriver: false,
    }
  );

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      <Animated.View
        style={[
          styles.header,
          {
            transform: [
              {
                translateY: headerTranslate,
              },
            ],
          },
        ]}
      >
        <Header
          navigation={navigation}
          headerOpacity={headerOpacity}
          currentUser={currentUser}
        />
      </Animated.View>

      {posts.length > 0 ? (
        <FlatList
          data={posts}
          keyExtractor={(item, index) =>
            item?.id?.toString() ||
            index.toString()
          }
          renderItem={renderPostItem}
          ListHeaderComponent={
            renderHeaderComponent
          }
          contentContainerStyle={
            styles.contentContainer
          }
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onEndReached={fetchOlderPosts}
          onEndReachedThreshold={0.5}
          initialNumToRender={8}
          maxToRenderPerBatch={6}
          windowSize={7}
          refreshControl={
            <RefreshControl
              refreshing={
                refreshing || isLoading
              }
              onRefresh={handleRefresh}
              tintColor="#fff"
              colors={["#fff"]}
              progressViewOffset={55}
            />
          }
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <View style={styles.footerSpace} />
          }
        />
      ) : (
        <View style={styles.skeletonContainer}>
          <FlatList
            data={["", "", ""]}
            ListHeaderComponent={
              renderHeaderComponent
            }
            renderItem={() => (
              <PostsSkeleton />
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#fff"
                colors={["#fff"]}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  header: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 28,
    height: 52,
    zIndex: 10,
    backgroundColor: "#000",
  },

  contentContainer: {
    paddingTop: 50,
  },

  skeletonContainer: {
    flex: 1,
    paddingTop: 52,
  },

  footerSpace: {
    height: 45,
  },
});

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Platform,
} from "react-native";
import useFetchUserPosts from "../../hooks/useFetchUserPosts";
import SubHeader from "./SubHeader";
import { Divider } from "react-native-elements";
import SkeletonDefaultPosts from "../search/Skeletons/SkeletonDefaultPosts";
import RenderItem from "../shared/RenderItem";

const StoryHighlights = ({ navigation, currentUser }) => {
  const {
    posts = [],
    loader,
    fetchOlderPosts,
    refreshPosts,
  } = useFetchUserPosts(currentUser?.email);

  const validPosts = Array.isArray(posts)
    ? posts.filter(
        (post) => post?.id !== "empty"
      )
    : [];

  const renderListHeaderComponent = () => (
    <View>
      <SubHeader
        navigation={navigation}
        currentUser={currentUser}
        numberOfPosts={validPosts.length}
      />

      <Text style={styles.title}>
        Story Highlights
      </Text>

      <Divider
        width={0.5}
        color="#222"
      />

      <View style={styles.gap} />
    </View>
  );

  if (loader && validPosts.length === 0) {
    return (
      <View style={styles.container}>
        <FlatList
          style={{
            flex: 1,
            marginTop: 14,
          }}
          data={Array.from(
            { length: 30 },
            (_, index) => index
          )}
          ListHeaderComponent={
            renderListHeaderComponent
          }
          numColumns={3}
          renderItem={() => (
            <SkeletonDefaultPosts />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {validPosts.length > 0 ? (
        <FlatList
          data={validPosts}
          keyExtractor={(item, index) =>
            item?.id?.toString() ||
            index.toString()
          }
          renderItem={({ item }) => (
            <RenderItem
              navigation={navigation}
              item={item}
            />
          )}
          numColumns={3}
          ListHeaderComponent={
            renderListHeaderComponent
          }
          scrollEventThrottle={16}
          onEndReached={fetchOlderPosts}
          onEndReachedThreshold={1}
          initialNumToRender={12}
          onRefresh={refreshPosts}
          refreshing={loader}
          ListFooterComponent={
            <View style={{ height: 50 }} />
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          {renderListHeaderComponent()}

          <Text style={styles.emptyTitle}>
            No posts yet
          </Text>

          <Text style={styles.emptyText}>
            Your posts will appear here.
          </Text>
        </View>
      )}
    </View>
  );
};

export default StoryHighlights;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  title: {
    color: "#fff",
    fontSize: 13,
    fontWeight:
      Platform.OS === "android"
        ? "600"
        : "700",
    marginHorizontal: 20,
    marginTop:
      Platform.OS === "android" ? 22 : 15,
    marginBottom:
      Platform.OS === "android" ? 12 : 8,
  },

  emptyContainer: {
    flex: 1,
  },

  emptyTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 70,
  },

  emptyText: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },

  gap: {
    height: 0,
  },
});

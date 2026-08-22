import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Platform,
  RefreshControl,
} from "react-native";
import useFetchUserPosts from "../../hooks/useFetchUserPosts";
import { Divider } from "react-native-elements";
import SubHeader from "./SubHeader";
import RenderItem from "../shared/RenderItem";

const StoryHighlights = ({
  navigation,
  user,
}) => {
  const {
    posts = [],
    loader,
    fetchOlderPosts,
    refreshPosts,
  } = useFetchUserPosts(
    user?.email
  );

  const ListHeaderComponent =
    () => (
      <View>
        <SubHeader
          user={user}
          navigation={navigation}
        />

        <View
          style={styles.sectionHeader}
        >
          <Text
            style={styles.title}
          >
            Posts
          </Text>
        </View>

        <View
          style={styles.highlightLine}
        />
      </View>
    );

  if (
    !user?.email
  ) {
    return null;
  }

  if (
    !loader &&
    posts.length === 0
  ) {
    return (
      <View
        style={styles.emptyContainer}
      >
        <ListHeaderComponent />

        <View
          style={styles.emptyPosts}
        >
          <Text
            style={
              styles.emptyTitle
            }
          >
            No posts yet
          </Text>

          <Text
            style={
              styles.emptyText
            }
          >
            Posts will appear here.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(
          item,
          index
        ) =>
          item?.id?.toString() ||
          index.toString()
        }
        renderItem={({
          item,
        }) => (
          <RenderItem
            item={item}
            navigation={navigation}
          />
        )}
        numColumns={3}
        ListHeaderComponent={
          ListHeaderComponent
        }
        scrollEventThrottle={16}
        onEndReached={
          fetchOlderPosts
        }
        onEndReachedThreshold={1}
        initialNumToRender={9}
        maxToRenderPerBatch={9}
        windowSize={7}
        onRefresh={refreshPosts}
        refreshing={loader}
        refreshControl={
          <RefreshControl
            refreshing={loader}
            onRefresh={refreshPosts}
            tintColor="#fff"
            colors={["#fff"]}
          />
        }
        showsVerticalScrollIndicator={
          false
        }
        ListFooterComponent={
          <View
            style={{
              height: 40,
            }}
          />
        }
      />
    </View>
  );
};

export default StoryHighlights;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  emptyContainer: {
    flex: 1,
    backgroundColor: "#000",
  },

  sectionHeader: {
    paddingHorizontal: 20,
    marginTop:
      Platform.OS === "android"
        ? 14
        : 12,
    marginBottom: 8,
  },

  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },

  highlightLine: {
    height: 1,
    marginHorizontal: 15,
    backgroundColor: "#252525",
    marginBottom: 4,
  },

  emptyPosts: {
    alignItems: "center",
    paddingTop: 65,
  },

  emptyTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  emptyText: {
    color: "#777",
    fontSize: 12,
    marginTop: 5,
  },
});

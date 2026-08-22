import {
  StyleSheet,
  Text,
  View,
  Animated,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useEffect, useState } from "react";
import TitleBar from "../components/shared/TitleBar";
import SearchBar from "../components/shared/SearchBar";
import Followers from "../components/follow/Followers";
import Requests from "../components/follow/Requests";
import Following from "../components/follow/Following";
import useFetchRequests from "../hooks/useFetchRequests";
import useFetchFollowers from "../hooks/useFetchFollowers";
import useFetchFollowing from "../hooks/useFetchFollowing";
import useTabSlideAnimation from "../utils/useTabSlideAnimation";
import { useUserContext } from "../contexts/UserContext";
import { SIZES } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";

const Follow = ({ navigation }) => {
  const { currentUser } = useUserContext();

  const [onSearch, setOnSearch] = useState(false);
  const [resetSearchBar, setResetSearchBar] = useState(0);
  const [filteredFollowers, setFilteredFollowers] = useState([]);
  const [filteredFollowing, setFilteredFollowing] = useState([]);

  const { requests = [] } = useFetchRequests({
    user: currentUser,
  });

  const { followers = [] } = useFetchFollowers({
    user: currentUser,
  });

  const { following = [] } = useFetchFollowing({
    user: currentUser,
  });

  const {
    handleTabChange,
    translation,
    activeButton,
  } = useTabSlideAnimation();

  useEffect(() => {
    setFilteredFollowers(followers);
  }, [followers]);

  useEffect(() => {
    setFilteredFollowing(following);
  }, [following]);

  const resetSearch = () => {
    setOnSearch(false);
    setFilteredFollowers(followers);
    setFilteredFollowing(following);
    setResetSearchBar((value) => value + 1);
  };

  const childPropChange = (searchKey) => {
    const normalizedKey = String(searchKey || "")
      .trim()
      .toLowerCase();

    if (!normalizedKey) {
      setOnSearch(false);
      setFilteredFollowers(followers);
      setFilteredFollowing(following);
      return;
    }

    setOnSearch(true);

    const matchesUser = (user) => {
      const username = String(
        user?.username || ""
      ).toLowerCase();

      const name = String(
        user?.name || ""
      ).toLowerCase();

      const email = String(
        user?.email || ""
      ).toLowerCase();

      return (
        username.includes(normalizedKey) ||
        name.includes(normalizedKey) ||
        email.includes(normalizedKey)
      );
    };

    if (activeButton === 0) {
      setFilteredFollowers(
        followers.filter(matchesUser)
      );
    }

    if (activeButton === 1) {
      setFilteredFollowing(
        following.filter(matchesUser)
      );
    }
  };

  const selectTab = (tabIndex) => {
    resetSearch();
    handleTabChange(tabIndex);
  };

  const renderEmpty = (
    title,
    message
  ) => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>
        {title}
      </Text>

      <Text style={styles.emptyText}>
        {message}
      </Text>
    </View>
  );

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      disabled
    >
      <SafeAreaView
        style={styles.container}
        edges={["top", "bottom"]}
      >
        <TitleBar
          navigation={navigation}
          name={currentUser?.username || "Profile"}
        />

        <View style={styles.rowContainer}>
          <TouchableOpacity
            onPress={() => selectTab(0)}
          >
            <Text style={styles.textTitle}>
              {followers.length > 0
                ? `${followers.length}  Followers`
                : "Followers"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => selectTab(1)}
          >
            <Text style={styles.textTitle}>
              {following.length > 0
                ? `${following.length}  Following`
                : "Following"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => selectTab(2)}
          >
            <Text style={styles.textTitle}>
              {requests.length > 0
                ? `${requests.length}  Requests`
                : "Requests"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.lineContainer}>
          <View
            style={
              activeButton === 0
                ? styles.highlightedOn
                : styles.highlightedOff
            }
          />
          <View
            style={
              activeButton === 1
                ? styles.highlightedOn
                : styles.highlightedOff
            }
          />
          <View
            style={
              activeButton === 2
                ? styles.highlightedOn
                : styles.highlightedOff
            }
          />
        </View>

        <Animated.View
          style={[
            styles.flatListContainer,
            {
              transform: [
                {
                  translateX: translation,
                },
              ],
            },
          ]}
        >
          {/* FOLLOWERS */}
          <View style={{ width: SIZES.Width }}>
            <FlatList
              ListHeaderComponent={
                <SearchBar
                  onPropChange={childPropChange}
                  resetSearchBar={resetSearchBar}
                />
              }
              data={
                onSearch
                  ? filteredFollowers
                  : followers
              }
              keyExtractor={(item, index) =>
                item?.email || String(index)
              }
              renderItem={({ item }) => (
                <Followers
                  user={item}
                  currentUser={currentUser}
                  navigation={navigation}
                />
              )}
              ListEmptyComponent={renderEmpty(
                "No followers yet",
                "Follow people and connect with others to see your followers here."
              )}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            />
          </View>

          {/* FOLLOWING */}
          <View style={{ width: SIZES.Width }}>
            <FlatList
              ListHeaderComponent={
                <SearchBar
                  onPropChange={childPropChange}
                  resetSearchBar={resetSearchBar}
                />
              }
              data={
                onSearch
                  ? filteredFollowing
                  : following
              }
              keyExtractor={(item, index) =>
                item?.email || String(index)
              }
              renderItem={({ item }) => (
                <Following
                  user={item}
                  currentUser={currentUser}
                  navigation={navigation}
                />
              )}
              ListEmptyComponent={renderEmpty(
                "You're not following anyone",
                "Start following people to see them here."
              )}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            />
          </View>

          {/* REQUESTS */}
          <View style={{ width: SIZES.Width }}>
            <FlatList
              ListHeaderComponent={
                <Text style={styles.requestsText}>
                  {requests.length > 0
                    ? "They want to start following you:"
                    : "No requests for now."}
                </Text>
              }
              data={requests}
              keyExtractor={(item, index) =>
                item?.email || String(index)
              }
              renderItem={({ item }) => (
                <Requests
                  user={item}
                  currentUser={currentUser}
                  navigation={navigation}
                />
              )}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            />
          </View>
        </Animated.View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Follow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 0,
  },

  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginTop: 10,
  },

  textTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  lineContainer: {
    flexDirection: "row",
    marginTop: 14,
  },

  highlightedOff: {
    flex: 1,
    backgroundColor: "#222",
    height: 1,
  },

  highlightedOn: {
    flex: 1,
    backgroundColor: "#ccc",
    height: 1,
  },

  flatListContainer: {
    flex: 1,
    flexDirection: "row",
    width: "300%",
  },

  requestsText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 15,
    marginHorizontal: 20,
  },

  emptyContainer: {
    flex: 1,
    minHeight: 240,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 80,
  },

  emptyTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },

  emptyText: {
    color: "#999",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    maxWidth: 320,
  },
});

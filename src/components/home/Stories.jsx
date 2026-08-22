import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo } from "react";
import { Image } from "expo-image";
import { useStoriesContext } from "../../contexts/StoriesContext";
import useCheckStoriesSeen from "../../hooks/useCheckStoriesSeen";
import { Entypo } from "@expo/vector-icons";

const Stories = ({ navigation, currentUser }) => {
  const { stories = [] } = useStoriesContext();
  const { checkStoriesSeen } = useCheckStoriesSeen();

  const ownStories = useMemo(
    () =>
      stories.filter(
        (story) => story?.username === currentUser?.username
      ),
    [stories, currentUser?.username]
  );

  const hasOwnStory = ownStories.length > 0;

  const seenOwnStory = hasOwnStory
    ? checkStoriesSeen(currentUser?.username, currentUser?.email)
    : false;

  const reducedStories = useMemo(() => {
    const seenUsers = new Set();
    const result = [];

    for (const story of stories) {
      if (!story?.username || seenUsers.has(story.username)) {
        continue;
      }

      seenUsers.add(story.username);
      result.push(story);
    }

    return result;
  }, [stories]);

  const handleOwnStoryPress = () => {
    if (hasOwnStory) {
      navigation.navigate("Story", {
        stories: ownStories,
        currentUser,
      });
      return;
    }

    navigation.navigate("MediaLibrary", {
      initialSelectedType: "Add to story",
      selectorAvailable: false,
    });
  };

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Kendi profilin her zaman ilk sırada */}
        <View style={styles.container}>
          <TouchableOpacity
            onPress={handleOwnStoryPress}
            activeOpacity={0.85}
          >
            {!hasOwnStory ? (
              <View>
                <View style={styles.emptyStoryBorder}>
                  <Image
                    source={{
                      uri: currentUser?.profile_picture || "",
                    }}
                    style={styles.image}
                  />
                </View>

                <View style={styles.addBtn}>
                  <Entypo name="plus" size={18} color="#eee" />
                </View>

                <Text style={styles.seenUser}>Your story</Text>
              </View>
            ) : seenOwnStory ? (
              <View>
                <View style={styles.seenStoryBorder}>
                  <Image
                    source={{
                      uri: currentUser?.profile_picture || "",
                    }}
                    style={styles.imageWithStory}
                  />
                </View>

                <Text style={styles.seenUser}>Your story</Text>
              </View>
            ) : (
              <View>
                <LinearGradient
                  start={[0.9, 0.45]}
                  end={[0.07, 1.03]}
                  colors={["#ff00ff", "#ff4400", "#ffff00"]}
                  style={styles.unseenRainbowBorder}
                >
                  <Image
                    source={{
                      uri: currentUser?.profile_picture || "",
                    }}
                    style={styles.imageWithStory}
                  />
                </LinearGradient>

                <Text style={styles.seenUser}>Your story</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Diğer kullanıcıların story'leri */}
        {reducedStories
          .filter(
            (story) =>
              story?.username !== currentUser?.username
          )
          .map((story) => {
            const storySeen = checkStoriesSeen(
              story?.username,
              currentUser?.email
            );

            return (
              <View
                style={styles.container}
                key={story?.username}
              >
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() =>
                    navigation.navigate("Story", {
                      stories: stories.filter(
                        (eachStory) =>
                          eachStory?.username === story?.username
                      ),
                      currentUser,
                    })
                  }
                >
                  {storySeen ? (
                    <View style={styles.itemContainer}>
                      <View style={styles.seenStoryBorder}>
                        <Image
                          source={{
                            uri: story?.profile_picture || "",
                          }}
                          style={styles.imageWithStory}
                        />
                      </View>

                      <Text
                        numberOfLines={1}
                        style={styles.seenUser}
                      >
                        {story?.username}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.itemContainer}>
                      <LinearGradient
                        start={[0.9, 0.45]}
                        end={[0.07, 1.03]}
                        colors={["#ff00ff", "#ff4400", "#ffff00"]}
                        style={styles.unseenRainbowBorder}
                      >
                        <Image
                          source={{
                            uri: story?.profile_picture || "",
                          }}
                          style={styles.imageWithStory}
                        />
                      </LinearGradient>

                      <Text
                        numberOfLines={1}
                        style={styles.user}
                      >
                        {story?.username}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
      </ScrollView>
    </View>
  );
};

export default Stories;

const styles = StyleSheet.create({
  scrollContent: {
    paddingRight: 12,
  },

  container: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 11,
    marginLeft: 12,
  },

  itemContainer: {
    width: 94,
    alignItems: "center",
  },

  emptyStoryBorder: {
    height: 91.5,
    width: 91.5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: "#444",
  },

  image: {
    height: 83,
    width: 83,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#444",
  },

  user: {
    marginTop: 3,
    fontSize: 12,
    color: "#fff",
    textAlign: "center",
  },

  seenUser: {
    marginTop: 4,
    fontSize: 12,
    color: "#bbb",
    textAlign: "center",
  },

  imageWithStory: {
    height: 86,
    width: 86,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#000",
  },

  seenStoryBorder: {
    height: 91.5,
    width: 91.5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: "#666",
  },

  unseenRainbowBorder: {
    height: 91.5,
    width: 91.5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },

  addBtn: {
    backgroundColor: "#18d",
    height: 30,
    width: 30,
    borderRadius: 100,
    borderWidth: 3.5,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    position: "absolute",
    left: 54,
    top: 54,
  },
});

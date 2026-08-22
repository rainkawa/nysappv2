import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";
import { useEffect, useState } from "react";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { Image } from "expo-image";
import { useVideoPlayer, VideoView } from "expo-video";
import CameraModule from "../components/shared/CameraModule";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;
const GRID_GAP = 2;
const GRID_COLUMNS = 3;
const THUMB_SIZE =
  (SCREEN_WIDTH - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;

const VideoPreview = ({ uri }) => {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  return (
    <VideoView
      player={player}
      style={styles.previewMedia}
      contentFit="contain"
      nativeControls={false}
    />
  );
};

const MediaLibraryScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();

  const {
    initialSelectedType = "New post",
    selectorAvailable = true,
  } = route.params || {};

  const [selectedType, setSelectedType] =
    useState(initialSelectedType);

  const [assets, setAssets] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cameraModalVisible, setCameraModalVisible] = useState(false);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      setLoading(true);

      const permission =
        await MediaLibrary.requestPermissionsAsync();

      if (!permission.granted) {
        setPermissionDenied(true);
        return;
      }

      const result = await MediaLibrary.getAssetsAsync({
        first: 200,
        mediaType: ["photo", "video"],
        sortBy: [MediaLibrary.SortBy.creationTime],
      });

      setAssets(result.assets || []);

      if (result.assets?.length > 0) {
        selectAsset(result.assets[0]);
      }
    } catch (error) {
      console.error("Gallery loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectAsset = (asset) => {
    if (!asset) return;

    setSelectedMedia({
      id: asset.id,
      uri: asset.uri,
      type: asset.mediaType === "video" ? "video" : "image",
      width: asset.width || 1,
      height: asset.height || 1,
      duration: asset.duration || 0,
    });
  };

  const handleTypeSelector = (type) => {
    setSelectedType(type);
    setSelectedMedia(null);

    if (type === "New reel") {
      const firstVideo = assets.find(
        (asset) => asset.mediaType === "video"
      );

      if (firstVideo) {
        selectAsset(firstVideo);
      }
    } else {
      const firstPhoto = assets.find(
        (asset) => asset.mediaType === "photo"
      );

      if (firstPhoto) {
        selectAsset(firstPhoto);
      }
    }
  };

  const handleNext = () => {
    if (!selectedMedia) return;

    if (selectedType === "New post") {
      navigation.navigate("NewPost", {
        selectedImage: selectedMedia.uri,
        mediaType: selectedMedia.type,
        width: selectedMedia.width,
        height: selectedMedia.height,
      });
      return;
    }

    if (selectedType === "Add to story") {
      navigation.navigate("NewStory", {
        selectedImage: selectedMedia,
      });
      return;
    }

    if (selectedType === "New reel") {
      navigation.navigate("NewReel", {
        selectedImage: selectedMedia,
      });
    }
  };

  const setCapturedPhoto = (photo) => {
    const media = {
      id: Date.now().toString(),
      uri: photo,
      type: "image",
      width: 1,
      height: 1,
    };

    setSelectedMedia(media);
    setCameraModalVisible(false);
  };

  const renderAsset = ({ item }) => {
    const selected = selectedMedia?.id === item.id;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => selectAsset(item)}
        style={[
          styles.gridItem,
          selected && styles.selectedGridItem,
        ]}
      >
        <Image
          source={{ uri: item.uri }}
          style={styles.thumbnail}
          contentFit="cover"
        />

        {item.mediaType === "video" && (
          <View style={styles.videoBadge}>
            <Feather name="video" size={14} color="#fff" />
          </View>
        )}

        {selected && (
          <View style={styles.selectedBadge}>
            <MaterialIcons
              name="check"
              size={18}
              color="#fff"
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const filteredAssets = assets.filter((asset) => {
    if (selectedType === "New reel") {
      return asset.mediaType === "video";
    }

    return asset.mediaType === "photo";
  });

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <MaterialIcons name="close" size={30} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {selectedType}
        </Text>

        {selectedMedia ? (
          <TouchableOpacity
            onPress={handleNext}
            style={styles.nextButtonContainer}
          >
            <Text style={styles.nextButton}>Next</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.headerButton}>
            {loading && <ActivityIndicator color="#fff" />}
          </View>
        )}
      </View>

      {permissionDenied ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons
            name="photo-library"
            size={64}
            color="#555"
          />
          <Text style={styles.emptyTitle}>
            Gallery permission required
          </Text>
          <Text style={styles.emptyText}>
            Allow photo access to select media.
          </Text>

          <TouchableOpacity
            style={styles.selectButton}
            onPress={loadGallery}
          >
            <Text style={styles.selectButtonText}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.previewContainer}>
            {selectedMedia ? (
              <View
                style={[
                  styles.preview,
                  {
                    aspectRatio:
                      selectedMedia.width /
                      selectedMedia.height,
                  },
                ]}
              >
                {selectedMedia.type === "video" ? (
                  <VideoPreview uri={selectedMedia.uri} />
                ) : (
                  <Image
                    source={{ uri: selectedMedia.uri }}
                    style={styles.previewMedia}
                    contentFit="contain"
                  />
                )}
              </View>
            ) : (
              <View style={styles.noPreview}>
                <MaterialIcons
                  name="photo-library"
                  size={50}
                  color="#444"
                />
              </View>
            )}
          </View>

          <View style={styles.galleryHeader}>
            <Text style={styles.galleryTitle}>
              Recent
            </Text>

            <TouchableOpacity
              style={styles.cameraSmallButton}
              onPress={() => setCameraModalVisible(true)}
            >
              <Feather name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          ) : (
            <FlatList
              data={filteredAssets}
              keyExtractor={(item) => item.id}
              renderItem={renderAsset}
              numColumns={3}
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={styles.gallery}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}

      {selectorAvailable && (
        <View style={styles.selector}>
          <TouchableOpacity
            onPress={() => handleTypeSelector("New post")}
          >
            <Text
              style={[
                styles.selectorText,
                selectedType === "New post" &&
                  styles.selectorActive,
              ]}
            >
              POST
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleTypeSelector("Add to story")}
          >
            <Text
              style={[
                styles.selectorText,
                selectedType === "Add to story" &&
                  styles.selectorActive,
              ]}
            >
              STORY
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleTypeSelector("New reel")}
          >
            <Text
              style={[
                styles.selectorText,
                selectedType === "New reel" &&
                  styles.selectorActive,
              ]}
            >
              REEL
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <CameraModule
        setCameraModalVisible={setCameraModalVisible}
        setCapturedPhoto={setCapturedPhoto}
        setSelectedType={setSelectedType}
        selectedType={selectedType}
        options={true}
      />
    </View>
  );
};

export default MediaLibraryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: Platform.OS === "android" ? 35 : 10,
  },

  header: {
    height: 55,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerButton: {
    width: 55,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },

  nextButtonContainer: {
    width: 55,
    alignItems: "flex-end",
  },

  nextButton: {
    color: "#1683ff",
    fontSize: 16,
    fontWeight: "800",
  },

  previewContainer: {
    width: "100%",
    height: SCREEN_WIDTH * 0.85,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#050505",
  },

  preview: {
    width: "100%",
    maxHeight: "100%",
    backgroundColor: "#050505",
    overflow: "hidden",
  },

  previewMedia: {
    width: "100%",
    height: "100%",
  },

  noPreview: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  galleryHeader: {
    height: 45,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  galleryTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  cameraSmallButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },

  gallery: {
    paddingBottom: 65,
  },

  columnWrapper: {
    gap: GRID_GAP,
  },

  gridItem: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    marginBottom: GRID_GAP,
    position: "relative",
    backgroundColor: "#111",
  },

  selectedGridItem: {
    opacity: 0.65,
  },

  thumbnail: {
    width: "100%",
    height: "100%",
  },

  selectedBadge: {
    position: "absolute",
    right: 6,
    top: 6,
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: "#1683ff",
    alignItems: "center",
    justifyContent: "center",
  },

  videoBadge: {
    position: "absolute",
    left: 6,
    bottom: 6,
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  emptyTitle: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "700",
    marginTop: 15,
  },

  emptyText: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },

  selectButton: {
    marginTop: 20,
    backgroundColor: "#1683ff",
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 10,
  },

  selectButtonText: {
    color: "#fff",
    fontWeight: "700",
  },

  selector: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 58,
    backgroundColor: "rgba(0,0,0,0.94)",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 45,
    borderTopWidth: 1,
    borderTopColor: "#222",
  },

  selectorText: {
    color: "#888",
    fontSize: 13,
    fontWeight: "800",
  },

  selectorActive: {
    color: "#fff",
  },
});

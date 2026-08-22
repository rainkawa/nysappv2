import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

const useMediaLibrary = () => {
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const pickMedia = async (type = "photo") => {
    try {
      setIsLoading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          type === "video"
            ? ["videos"]
            : ["images"],
        allowsEditing: type !== "video",
        aspect: type !== "video" ? [1, 1] : undefined,
        quality: 1,
        allowsMultipleSelection: false,
      });

      if (result.canceled || !result.assets?.length) {
        return null;
      }

      const asset = result.assets[0];

      if (asset.type === "video") {
        const video = {
          id: asset.assetId || Date.now().toString(),
          uri: asset.uri,
          localUri: asset.uri,
          type: "video",
          width: asset.width,
          height: asset.height,
          duration: asset.duration,
        };

        setVideos([video]);
        return video;
      }

      const image = {
        id: asset.assetId || Date.now().toString(),
        uri: asset.uri,
        type: "image",
        width: asset.width,
        height: asset.height,
      };

      setImages([image]);
      return image;
    } catch (error) {
      console.error("Media picker error:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = () => pickMedia("photo");
  const pickVideo = () => pickMedia("video");

  return {
    images,
    videos,
    isLoading,
    pickMedia,
    pickImage,
    pickVideo,
  };
};

export default useMediaLibrary;

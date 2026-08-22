import { manipulateAsync } from "expo-image-manipulator";

const useResizePictures = () => {
  const resizeProfilePicture = async (imageUri) => {
    if (!imageUri) throw new Error("Profile image URI missing");

    return await manipulateAsync(
      imageUri,
      [{ resize: { width: 320, height: 320 } }],
      { compress: 0.3 }
    );
  };

  const resizePostPicture = async (imageUri) => {
    if (!imageUri) throw new Error("Post image URI missing");

    return await manipulateAsync(
      imageUri,
      [{ resize: { width: 640, height: 640 } }],
      { compress: 0.3 }
    );
  };

  const resizeStoryPicture = async (imageUri) => {
    if (!imageUri) throw new Error("Story image URI missing");

    return await manipulateAsync(
      imageUri,
      [{ resize: { width: 640, height: 1280 } }],
      { compress: 0.3 }
    );
  };

  return {
    resizeProfilePicture,
    resizePostPicture,
    resizeStoryPicture,
  };
};

export default useResizePictures;

import { useState } from "react";

const CLOUDINARY_CLOUD_NAME = "sqqodjug";
const CLOUDINARY_UPLOAD_PRESET = "instagram_clon";

const useUploadPicture = () => {
  const [uploading, setUploading] = useState(false);

  const uploadPicture = async (uri, email, name) => {
    if (uploading || !uri) return null;

    setUploading(true);

    try {
      const formData = new FormData();

      const fileName = name
        ? `${name}.jpg`
        : `upload_${Date.now()}.jpg`;

      formData.append("file", {
        uri,
        type: "image/jpeg",
        name: fileName,
      });

      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      // Kullanıcı klasörü
      formData.append("folder", `instagram/${email}`);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Cloudinary upload error:", data);
        throw new Error(
          data?.error?.message || "Cloudinary upload failed"
        );
      }

      console.log("☁️ Cloudinary upload successful");
      console.log("🔗 URL:", data.secure_url);

      return data.secure_url;
    } catch (error) {
      console.error("❌ Upload failed:", error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadPicture,
    uploading,
  };
};

export default useUploadPicture;

import { useState } from "react";

const CLOUDINARY_CLOUD_NAME =
  "sqqodjug";

const CLOUDINARY_UPLOAD_PRESET =
  "instagram_clon";

const useUploadPicture = () => {
  const [
    uploading,
    setUploading,
  ] = useState(false);

  const uploadPicture = async (
    uri,
    email,
    name,
    mimeType = "image/jpeg"
  ) => {
    if (
      uploading ||
      !uri
    ) {
      return null;
    }

    setUploading(true);

    try {
      const formData =
        new FormData();

      const safeMime =
        mimeType?.startsWith(
          "image/"
        )
          ? mimeType
          : "image/jpeg";

      const extension =
        safeMime ===
        "image/png"
          ? "png"
          : safeMime ===
            "image/webp"
          ? "webp"
          : "jpg";

      const fileName =
        name
          ? `${name}.${extension}`
          : `upload_${Date.now()}.${extension}`;

      formData.append(
        "file",
        {
          uri,
          type: safeMime,
          name: fileName,
        }
      );

      formData.append(
        "upload_preset",
        CLOUDINARY_UPLOAD_PRESET
      );

      formData.append(
        "folder",
        `instagram/${email || "unknown"}`
      );

      console.log(
        "☁️ Cloudinary image upload started"
      );

      const response =
        await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

      const responseText =
        await response.text();

      let data = null;

      try {
        data =
          JSON.parse(
            responseText
          );
      } catch {
        data = {
          raw: responseText,
        };
      }

      console.log(
        "Cloudinary HTTP:",
        response.status
      );

      if (!response.ok) {
        console.error(
          "Cloudinary response:",
          data
        );

        throw new Error(
          data?.error?.message ||
            `Cloudinary upload failed (${response.status})`
        );
      }

      if (!data?.secure_url) {
        console.error(
          "Cloudinary missing secure_url:",
          data
        );

        throw new Error(
          "Cloudinary returned no secure_url."
        );
      }

      console.log(
        "☁️ Cloudinary image upload successful:",
        data.secure_url
      );

      return data.secure_url;
    } catch (error) {
      console.error(
        "❌ Cloudinary image upload failed:",
        error
      );

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

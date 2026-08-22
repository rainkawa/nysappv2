import { useState } from "react";

const useAlbumSelector = () => {
  const [selectedAlbum] = useState(null);
  const [selectedAlbumTitle] = useState("Gallery");
  const [allAlbums] = useState([]);

  const handleAlbumSelection = () => {};

  return {
    allAlbums,
    selectedAlbum,
    selectedAlbumTitle,
    handleAlbumSelection,
  };
};

export default useAlbumSelector;

import { useState } from "react";
import { Check, X } from "lucide-react";
import { useImageStore } from "../stores/useImageStore.js";
import { toast } from "react-hot-toast";

const ProductCard = ({ itemSrc, itemName }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(itemName);
  const [currentName, setCurrentName] = useState(itemName);
  const { getImages, saveImage, renameImage, removeImage } = useImageStore();
  async function handleSaveImage(Name) {
    try {
      const result = await saveImage(getPureName(Name));
      if (result.success) {
        await getImages();
        toast.success("Image saved successfully");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleRemoveImage(Name) {
    const nameWithoutExtension = Name.replace(/\.[^/.]+$/, "");
    try {
      const result = await removeImage(getPureName(Name));
      if (result.success) {
        await getImages();
        toast.success("Image removed successfully");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleRename() {
    setCurrentName(getPureName(itemName));
    setIsEditing(false);
    try {
      const result = await renameImage(getPureName(itemName), tempName);
      if (result.success) {
        await getImages();
        toast.success("Image renamed successfully");
      }
      console.log("Renamed to:", tempName);
    } catch (error) {
      console.log(error);
    }
  }

  function handleCancelEdit() {
    setTempName(currentName);
    setIsEditing(false);
  }

  function getPureName(nameWithExt) {
    return nameWithExt.replace(/\.[^/.]+$/, "");
  }

  function isSaved(name) {
    return name.startsWith("saved-");
  }

  function isRemoved(name) {
    return name.startsWith("removed-");
  }

  return (
    <div className="card max-w-xs shadow-xl bg-gray-200 text-base-content transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
      <figure className="h-64 w-full overflow-hidden flex items-center justify-center bg-gray-300">
        <img
          className="object-cover h-full w-full"
          src={itemSrc}
          alt={itemName}
        />
      </figure>

      <div className="card-body pt-4 pb-4">
        {!isEditing ? (
          <p
            className="text-sm text-black truncate cursor-pointer"
            onClick={() => {
              setTempName(getPureName(itemName));
              setIsEditing(true);
            }}
            title="Click to rename"
          >
            {itemName}
          </p>
        ) : (
          <div className="flex items-center gap-2">
            <input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="text-sm px-2 py-1 border border-gray-300 rounded w-full focus:outline-none focus:ring focus:border-blue-400"
              autoFocus
            />
            <button
              className="text-green-600 hover:text-green-800"
              onClick={handleRename}
              aria-label="Save"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={handleCancelEdit}
              aria-label="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="card-actions justify-between mt-4">
          <button
            onClick={() => handleSaveImage(itemName)}
            className={`btn btn-outline btn-sm ${
              isSaved(itemName)
                ? "text-gray-400 cursor-not-allowed"
                : "text-black"
            }`}
            disabled={isSaved(itemName)}
          >
            Save
          </button>
          <button
            onClick={() => handleRemoveImage(itemName)}
            className={`btn btn-outline btn-sm ${
              isRemoved(itemName)
                ? "text-gray-400 cursor-not-allowed"
                : "text-black"
            }`}
            disabled={isRemoved(itemName)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

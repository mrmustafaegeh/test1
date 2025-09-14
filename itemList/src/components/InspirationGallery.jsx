import { useState, useEffect } from "react";
import axios from "axios";
import InspirationCard from "./InspirationCard.jsx";

export default function InspirationGallery({ onSelect }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/storefront/create",
          {
            imageName: "motif",
            amount: 6,
            needsGeneration: "true",
          }
        );

        console.log("✅ Raw API Response:", response.data);

        // Extract only the real https:// part
        const cleaned = (response.data || []).map((img) => {
          const match = img.itemSrc.match(/https?:\/\/.+/);
          return {
            ...img,
            itemSrc: match ? match[0] : null, // null if no valid URL found
          };
        });

        console.log(
          "🖼️ Cleaned URLs:",
          cleaned.map((i) => i.itemSrc)
        );

        setImages(cleaned);
      } catch (err) {
        console.error("❌ Error fetching images:", err);
        setError("Failed to fetch images");
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="mt-10 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Connecting to server...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-auto max-w-md">
          <h3 className="font-bold">Connection Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Inspiration Gallery
      </h2>
      {images.length === 0 ? (
        <p className="text-center text-gray-500">No images found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {images.map((img, idx) =>
            img.itemSrc ? (
              <InspirationCard
                key={idx}
                src={img.itemSrc}
                title={img.itemName || `Inspiration ${idx + 1}`}
                onClick={() => onSelect(img.itemSrc)}
              />
            ) : (
              <div
                key={idx}
                className="border rounded-lg p-4 text-center text-gray-500"
              >
                Invalid image URL
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

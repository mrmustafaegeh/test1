// src/App.jsx
import React, { useState } from "react";
import InspirationGallery from "./components/InspirationGallery.jsx";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Optional: Show selected image on top */}
      {selectedImage && (
        <div className="mb-6 flex justify-center">
          <img
            src={selectedImage}
            alt="Selected motif"
            className="w-64 h-64 object-cover rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* Gallery */}
      <InspirationGallery onSelect={(img) => setSelectedImage(img)} />
    </div>
  );
}

export default App;

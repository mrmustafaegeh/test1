import React from "react";

function InspirationCard({ src, title, onClick }) {
  const handleKeyPress = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      onClick();
    }
  };

  return (
    <div
      className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={handleKeyPress}
      aria-label={`View inspiration: ${title}`}
    >
      <img
        src={src}
        alt={title || "Inspiration image"}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-center">{title}</h3>
      </div>
    </div>
  );
}

export default InspirationCard;

const LoadingSpinner = ({
  baseSize = "lg", // DaisyUI base size
  scale = 1.8, // Custom scale multiplier
  variant = "ring",
  color = "secondary",
  backdrop = true,
}) => {
  // DaisyUI size classes
  const sizeClasses = {
    xs: "loading-xs",
    sm: "loading-sm",
    md: "loading-md",
    lg: "loading-lg",
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${
        backdrop ? "bg-base-100 bg-opacity-80" : ""
      } z-50`}
    >
      <div
        className="transform origin-center"
        style={{ transform: `scale(${scale})` }}
      >
        <span
          className={`loading loading-${variant} ${sizeClasses[baseSize]} text-${color}`}
        ></span>
      </div>
    </div>
  );
};

export default LoadingSpinner;

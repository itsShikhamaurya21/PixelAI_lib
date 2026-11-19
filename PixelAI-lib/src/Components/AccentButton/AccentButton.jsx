import React from "react";
const AccentButton = () => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);
  
  const buttonStyle = {
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    backgroundColor: isActive ? "#2563eb" : isHovered ? "#1d4ed8" : "#3b82f6",
    color: "white",
    boxShadow: isActive ? "0 2px 4px rgba(0,0,0,0.1)" : isHovered ? "0 4px 6px rgba(0,0,0,0.1)" : "0 2px 4px rgba(0,0,0,0.05)",
    transform: isActive ? "scale(0.98)" : "scale(1)"
  };

  return (
    <button
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
    >
      Click Me
    </button>
  );
};

// For preview rendering
const ButtonPreview = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
    <AccentButton />
  </div>
);

export default AccentButton;
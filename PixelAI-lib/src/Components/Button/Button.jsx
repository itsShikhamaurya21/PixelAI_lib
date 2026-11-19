
import React, { useState } from "react";
const SIZES = {
  small: { padding: "6px 12px", fontSize: "13px" },
  medium: { padding: "10px 20px", fontSize: "15px" },
  large: { padding: "14px 28px", fontSize: "17px" },
};

export const Button = ({
  text = "Click me",
  toggledText = "Toggled",
  color = "#ffffff",
  backgroundColor = "#2f5d50",
  hoverColor = "#244a40",
  size = "medium",
  borderRadius = "8px",
  disabled = false,
  toggle = false,
  onClick = () => {},
}) => {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  const handleClick = (event) => {
    if (disabled) return;
    if (toggle) setActive((prev) => !prev);
    onClick(event, !active);
  };

  const style = {
    ...(SIZES[size] || SIZES.medium),
    color,
    backgroundColor: hovered && !disabled ? hoverColor : backgroundColor,
    border: "none",
    borderRadius,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    fontFamily: "inherit",
    fontWeight: 600,
    transform: hovered && !disabled ? "translateY(-1px)" : "none",
    boxShadow: active ? "inset 0 0 0 2px rgba(255,255,255,0.6)" : "none",
    transition: "background-color 0.15s, transform 0.15s",
  };
  return (
    <button
      type="button"
      style={style}
      disabled={disabled}
      aria-pressed={toggle ? active : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      {toggle && active ? toggledText : text}
    </button>
  );
};
// export default Button;
 

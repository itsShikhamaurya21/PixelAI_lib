import React, { useState } from "react";

const SIZES = {
  small: { width: "240px", padding: "14px", titleSize: "16px", textSize: "13px" },
  medium: { width: "320px", padding: "20px", titleSize: "19px", textSize: "15px" },
  large: { width: "420px", padding: "26px", titleSize: "23px", textSize: "17px" },
};

const VARIANTS = {
  outlined: (c) => ({ border: `1px solid ${c.borderColor}`, boxShadow: "none" }),
  elevated: () => ({ border: "1px solid transparent", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)" }),
  filled: (c) => ({
    border: "1px solid transparent",
    boxShadow: "none",
    backgroundColor: c.fillColor,
  }),
};

export const Card = ({
  // Content
  title = "Card title",
  subtitle = "",
  text = "This is a short description for the card.",
  expandedText = "Here is some extra detail that appears when the card is expanded.",
  image = "",
  imageAlt = "",
  imageHeight = "160px",
  footer = null,
  children = null,
  buttonText = "Learn more",
  collapseText = "Show less",

  // Appearance
  variant = "outlined",
  size = "medium",
  width = "",
  textColor = "#1f2a27",
  subtitleColor = "#5f6d68",
  backgroundColor = "#ffffff",
  fillColor = "#eef3f1",
  borderColor = "#d8dfdc",
  accentColor = "#2f5d50",
  borderRadius = "12px",
  align = "left",

  // Behavior
  expandable = true,
  selectable = false,
  hoverEffect = true,
  disabled = false,
  onClick = () => {},
  onSelect = () => {},

  // Style overrides
  style = {},
  titleStyle = {},
  textStyle = {},
}) => {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState(false);

  const s = SIZES[size] || SIZES.medium;
  const variantStyle = (VARIANTS[variant] || VARIANTS.outlined)({ borderColor, fillColor });
  const lifted = hoverEffect && hovered && !disabled;

  const handleToggle = (event) => {
    if (disabled) return;
    if (expandable) setExpanded((prev) => !prev);
    onClick(event, !expanded);
  };

  const handleSelect = (event) => {
    if (disabled || !selectable) return;
    setSelected((prev) => !prev);
    onSelect(event, !selected);
  };

  const cardStyle = {
    width: width || s.width,
    maxWidth: "100%",
    boxSizing: "border-box",
    overflow: "hidden",
    color: textColor,
    backgroundColor,
    borderRadius,
    textAlign: align,
    fontFamily: "inherit",
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? "not-allowed" : selectable ? "pointer" : "default",
    transform: lifted ? "translateY(-2px)" : "none",
    transition: "box-shadow 0.15s, transform 0.15s, border-color 0.15s",
    ...variantStyle,
    ...(lifted && { boxShadow: "0 6px 16px rgba(0, 0, 0, 0.14)" }),
    ...(selected && { border: `2px solid ${accentColor}` }),
    ...style,
  };

  const bodyStyle = { padding: s.padding };

  const headingStyle = {
    margin: 0,
    fontSize: s.titleSize,
    fontWeight: 600,
    ...titleStyle,
  };

  const subStyle = {
    margin: "4px 0 0",
    fontSize: s.textSize,
    color: subtitleColor,
  };

  const paragraphStyle = {
    margin: "12px 0 0",
    fontSize: s.textSize,
    lineHeight: 1.5,
    ...textStyle,
  };

  const buttonStyle = {
    marginTop: "12px",
    padding: 0,
    background: "none",
    border: "none",
    color: accentColor,
    fontSize: s.textSize,
    fontWeight: 600,
    fontFamily: "inherit",
    cursor: disabled ? "not-allowed" : "pointer",
    textDecoration: lifted ? "underline" : "none",
  };

  const footerStyle = {
    padding: `12px ${s.padding}`,
    borderTop: `1px solid ${borderColor}`,
    fontSize: s.textSize,
    color: subtitleColor,
  };

  return (
    <div
      style={cardStyle}
      aria-disabled={disabled}
      aria-selected={selectable ? selected : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleSelect}
    >
      {image && (
        <img
          src={image}
          alt={imageAlt}
          style={{ display: "block", width: "100%", height: imageHeight, objectFit: "cover" }}
        />
      )}

      <div style={bodyStyle}>
        <h3 style={headingStyle}>{title}</h3>
        {subtitle && <p style={subStyle}>{subtitle}</p>}
        {text && <p style={paragraphStyle}>{text}</p>}
        {expandable && expanded && <p style={paragraphStyle}>{expandedText}</p>}
        {children && <div style={{ marginTop: "12px" }}>{children}</div>}

        {expandable && (
          <button
            type="button"
            style={buttonStyle}
            disabled={disabled}
            aria-expanded={expanded}
            onClick={(event) => {
              event.stopPropagation();
              handleToggle(event);
            }}
          >
            {expanded ? collapseText : buttonText}
          </button>
        )}
      </div>

      {footer && <div style={footerStyle}>{footer}</div>}
    </div>
  );
};

// export default Card;
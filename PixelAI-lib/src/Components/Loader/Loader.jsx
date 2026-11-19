import React from "react";

function Loader({
  size = 48,
  color = "#3be8ff",
  text = "Loading...",
}) {
  return (
    <div
      style={{
        minHeight: "150px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "14px",
        background: "#071619",
        borderRadius: "16px",
        padding: "24px",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        style={{ display: "block" }}
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeOpacity="0.2"
        />

        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="80 126"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 25 25"
            to="360 25 25"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      {text && (
        <p
          style={{
            margin: 0,
            color: "#cbd5e1",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          {text}
        </p>
      )}
    </div>
  );
}

export default Loader;
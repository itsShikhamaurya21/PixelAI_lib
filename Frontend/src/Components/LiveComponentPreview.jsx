
import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";

import {
  LiveProvider,
  LivePreview,
  LiveError,
} from "react-live";

import { motion } from "framer-motion";
import { FiRefreshCw } from "react-icons/fi";

export const LiveComponentPreview = ({ code = "" }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  // Refresh Preview
  const refreshPreview = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  // Handle empty code
  if (!code || !code.trim()) {
    return (
      <div
        style={{
          padding: "16px",
          background: "#1e293b",
          color: "#cbd5e1",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        No component code available to preview.
      </div>
    );
  }

  // Clean AI-generated code
  let sanitized = code
    .replace(/import\s+.*?from\s+['"].*?['"];?/g, "")
    .replace(/export\s+default\s+/g, "")
    .replace(/export\s+/g, "");

  // Replace fixed positioning only in common inline style forms
  sanitized = sanitized
    .replace(
      /position\s*:\s*(['"])fixed\1/g,
      'position: "absolute"'
    )
    .replace(
      /position\s*:\s*fixed(?=\s*[,}])/g,
      'position: "absolute"'
    );

  // Detect component name:
  // const ProfileCard = () => {}
  // function ProfileCard() {}
  const match = sanitized.match(
    /(?:const|let|var)\s+([A-Z][A-Za-z0-9_]*)\s*=|function\s+([A-Z][A-Za-z0-9_]*)\s*\(/
  );

  const componentName = match
    ? match[1] || match[2]
    : null;

  // Prepare code for React Live
  const wrappedCode = componentName
    ? `${sanitized}\n\nrender(<${componentName} />);`
    : sanitized;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "100%",
      }}
    >
      {componentName ? (
        <LiveProvider
          key={refreshKey}
          code={wrappedCode}
          noInline
          scope={{
            React,
            useState,
            useEffect,
            useRef,
            useCallback,
            motion,
          }}
        >
          {/* Preview Container */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              width: "100%",
              minHeight: "300px",
              border: "1px solid #334155",
              borderRadius: "12px",
              background: "#f8fafc",
              position: "relative",
              overflow: "auto",
              padding: "clamp(10px, 2vw, 20px)",
            }}
          >
            {/* Refresh Button */}
            <motion.button
              type="button"
              onClick={refreshPreview}
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              title="Refresh Preview"
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "#1e293b",
                color: "#ffffff",
                border: "none",
                padding: "8px",
                borderRadius: "8px",
                cursor: "pointer",
                zIndex: 10,
              }}
            >
              <FiRefreshCw size={20} />
            </motion.button>

            {/* Live Component */}
            <div
              style={{
                width: "100%",
                minHeight: "260px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "auto",
                padding: "35px 10px 10px",
              }}
            >
              <LivePreview />
            </div>

            {/* Error Display */}
            <LiveError
              style={{
                marginTop: "10px",
                padding: "10px",
                background: "#450a0a",
                color: "#f87171",
                borderRadius: "6px",
                fontSize: "14px",
                overflowX: "auto",
                whiteSpace: "pre-wrap",
              }}
            />
          </motion.div>
        </LiveProvider>
      ) : (
        <div
          style={{
            marginTop: "10px",
            padding: "10px",
            background: "#1e293b",
            borderRadius: "6px",
            color: "#94a3b8",
            fontSize: "14px",
          }}
        >
          Preview is not available. Copy the code and paste it into your project.
        </div>
      )}
    </div>
  );
};

export default LiveComponentPreview;

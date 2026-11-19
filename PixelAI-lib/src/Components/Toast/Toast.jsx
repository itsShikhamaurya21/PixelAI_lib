import React, { useState } from "react";

function App() {
  const [visible, setVisible] = useState(true);

  const styles = {
    wrapper: {
      minHeight: "300px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f1f5f9",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
    },
    toast: {
      display: "flex",
      alignItems: "center",
      gap: "14px",
      width: "100%",
      maxWidth: "380px",
      padding: "16px 20px",
      background: "#dcfce7",
      color: "#166534",
      border: "1px solid #86efac",
      borderRadius: "12px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
    },
    icon: {
      width: "30px",
      height: "30px",
      borderRadius: "50%",
      background: "#16a34a",
      color: "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
      fontSize: "18px",
      flexShrink: 0,
    },
    message: {
      flex: 1,
      fontSize: "14px",
      fontWeight: "600",
      margin: 0,
    },
    close: {
      border: "none",
      background: "transparent",
      color: "#166534",
      fontSize: "22px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.wrapper}>
      {visible && (
        <div style={styles.toast}>
          <span style={styles.icon}>✓</span>

          <p style={styles.message}>
            Your changes have been saved successfully!
          </p>

          <button
            style={styles.close}
            onClick={() => setVisible(false)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
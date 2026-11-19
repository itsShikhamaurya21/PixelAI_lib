import React from "react";
const SecondaryButton = ({ label, onClick }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  const buttonStyle = {
    padding: '12px 24px',
    backgroundColor: isActive ? '#2c3e50' : isHovered ? '#34495e' : '#3498db',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
    outline: 'none',
  };

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
    >
      {label}
    </button>
  );
};

SecondaryButton.defaultProps = {
  label: 'Secondary Button',
  onClick: () => {}
};

export default SecondaryButton;
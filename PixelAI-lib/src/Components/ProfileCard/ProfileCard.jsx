import React, { useState } from "react";

const SIZES = {
  small: { width: "240px", padding: "16px", avatar: 64, nameSize: "16px", textSize: "13px" },
  medium: { width: "300px", padding: "22px", avatar: 88, nameSize: "20px", textSize: "15px" },
  large: { width: "380px", padding: "28px", avatar: 112, nameSize: "24px", textSize: "17px" },
};

const getInitials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

export const ProfileCard = ({
  name = "Jane Doe",
  role = "Product Designer",
  bio = "Designing simple, useful things. Coffee enthusiast and weekend hiker.",
  avatar = "",
  followers = 1240,
  following = 318,
  followText = "Follow",
  followingText = "Following",
  size = "medium",
  textColor = "#1f2a27",
  mutedColor = "#5f6d68",
  backgroundColor = "#ffffff",
  borderColor = "#d8dfdc",
  accentColor = "#2f5d50",
  buttonTextColor = "#ffffff",
  borderRadius = "14px",
  showStats = true,
  showBio = true,
  onFollow = () => {},
}) => {
  const [hovered, setHovered] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const s = SIZES[size] || SIZES.medium;
  const followerCount = followers + (isFollowing ? 1 : 0);

  const handleFollow = () => {
    setIsFollowing((prev) => !prev);
    onFollow(!isFollowing);
  };

  const cardStyle = {
    width: s.width,
    maxWidth: "100%",
    boxSizing: "border-box",
    padding: s.padding,
    textAlign: "center",
    color: textColor,
    backgroundColor,
    border: `1px solid ${hovered ? accentColor : borderColor}`,
    borderRadius,
    boxShadow: hovered
      ? "0 8px 20px rgba(0, 0, 0, 0.14)"
      : "0 1px 3px rgba(0, 0, 0, 0.08)",
    transform: hovered ? "translateY(-2px)" : "none",
    transition: "box-shadow 0.15s, transform 0.15s, border-color 0.15s",
    fontFamily: "inherit",
  };

  const avatarStyle = {
    width: `${s.avatar}px`,
    height: `${s.avatar}px`,
    margin: "0 auto 14px",
    borderRadius: "50%",
    objectFit: "cover",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: accentColor,
    color: buttonTextColor,
    fontSize: `${s.avatar / 2.6}px`,
    fontWeight: 600,
  };

  const statsStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "24px",
    margin: "16px 0",
    fontSize: s.textSize,
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px 0",
    fontSize: s.textSize,
    fontWeight: 600,
    fontFamily: "inherit",
    cursor: "pointer",
    borderRadius: "8px",
    border: `1px solid ${accentColor}`,
    color: isFollowing ? accentColor : buttonTextColor,
    backgroundColor: isFollowing
      ? buttonHovered
        ? "rgba(47, 93, 80, 0.1)"
        : "transparent"
      : accentColor,
    opacity: !isFollowing && buttonHovered ? 0.88 : 1,
    transition: "background-color 0.15s, opacity 0.15s",
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {avatar ? (
        <img src={avatar} alt={name} style={{ ...avatarStyle, display: "block" }} />
      ) : (
        <div style={avatarStyle} aria-label={name}>
          {getInitials(name)}
        </div>
      )}

      <h3 style={{ margin: 0, fontSize: s.nameSize, fontWeight: 600 }}>{name}</h3>
      <p style={{ margin: "4px 0 0", fontSize: s.textSize, color: mutedColor }}>{role}</p>

      {showBio && (
        <p style={{ margin: "12px 0 0", fontSize: s.textSize, lineHeight: 1.5 }}>{bio}</p>
      )}

      {showStats && (
        <div style={statsStyle}>
          <div>
            <strong>{followerCount.toLocaleString()}</strong>
            <div style={{ color: mutedColor }}>Followers</div>
          </div>
          <div>
            <strong>{following.toLocaleString()}</strong>
            <div style={{ color: mutedColor }}>Following</div>
          </div>
        </div>
      )}

      <button
        type="button"
        style={buttonStyle}
        aria-pressed={isFollowing}
        onMouseEnter={() => setButtonHovered(true)}
        onMouseLeave={() => setButtonHovered(false)}
        onClick={handleFollow}
      >
        {isFollowing ? followingText : followText}
      </button>
    </div>
  );
};

// export default ProfileCard;
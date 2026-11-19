import React from "react";
const ProductCard = () => {
  const [quantity, setQuantity] = React.useState(1);
  const [isAddedToCart, setIsAddedToCart] = React.useState(false);
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  const product = {
    name: "Wireless Headphones",
    price: 99.99,
    rating: 4.5,
    reviews: 128,
    description: "Premium wireless headphones with noise cancellation and 30-hour battery life.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
  };

  const handleAddToCart = () => {
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity > 0 && newQuantity < 10) {
      setQuantity(newQuantity);
    }
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div style={{
      width: "280px",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      fontFamily: "'Segoe UI', sans-serif",
      backgroundColor: "#fff"
    }}>
      <div style={{
        position: "relative"
      }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "100%",
            height: "220px",
            objectFit: "cover",
            display: "block"
          }}
        />
        <button
          onClick={handleWishlistToggle}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}
        >
          {isWishlisted ? "♥" : "♡"}
        </button>
      </div>

      <div style={{
        padding: "16px"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px"
        }}>
          <h3 style={{
            margin: "0",
            fontSize: "18px",
            fontWeight: "600",
            color: "#333"
          }}>{product.name}</h3>
          <div style={{
            color: "#ff9500",
            fontWeight: "600",
            fontSize: "20px"
          }}>${product.price.toFixed(2)}</div>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "12px",
          gap: "6px"
        }}>
          <div style={{
            color: "#ff9500",
            fontWeight: "bold"
          }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>{i < Math.floor(product.rating) ? "★" : "☆"}</span>
            ))}
          </div>
          <span style={{
            color: "#666",
            fontSize: "14px"
          }}>({product.reviews})</span>
        </div>

        <p style={{
          color: "#666",
          fontSize: "14px",
          marginBottom: "16px",
          lineHeight: "1.5"
        }}>{product.description}</p>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #ddd",
            borderRadius: "6px",
            overflow: "hidden"
          }}>
            <button
              onClick={() => handleQuantityChange(-1)}
              style={{
                border: "none",
                background: "#f5f5f5",
                padding: "8px 12px",
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              -
            </button>
            <span style={{
              padding: "8px 16px",
              fontWeight: "600"
            }}>{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              style={{
                border: "none",
                background: "#f5f5f5",
                padding: "8px 12px",
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              +
            </button>
          </div>

          <div style={{
            fontWeight: "bold",
            color: "#333",
            fontSize: "18px"
          }}>
            ${(product.price * quantity).toFixed(2)}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          style={{
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "6px",
            backgroundColor: isAddedToCart ? "#4caf50" : "#007aff",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background-color 0.2s"
          }}
        >
          {isAddedToCart ? "Added to Cart!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
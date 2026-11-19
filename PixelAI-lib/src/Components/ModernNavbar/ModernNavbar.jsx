import React from "react";
export const ModernNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const navLinks = [
    { name: "Home", href: "#" },
    { name: "Products", href: "#" },
    { name: "About", href: "#" },
    { name: "Contact", href: "#" }
  ];
  
  return (
    <nav style={{
      backgroundColor: "#ffffff",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      padding: "16px 24px",
      position: "sticky",
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "16px"
        }}>
          <div style={{
            fontWeight: "bold",
            fontSize: "24px",
            color: "#2563eb"
          }}>
            Brand
          </div>
        </div>
        
        <div style={{
          display: { xs: "none", md: "flex" },
          gap: "24px",
          alignItems: "center"
        }}>
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href}
              style={{
                textDecoration: "none",
                color: "#1f2937",
                fontWeight: "500",
                fontSize: "16px",
                transition: "color 0.2s",
                ":hover": {
                  color: "#2563eb"
                }
              }}
            >
              {link.name}
            </a>
          ))}
          <button 
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "8px 16px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.2s",
              ":hover": {
                backgroundColor: "#1d4ed8"
              }
            }}
          >
            Get Started
          </button>
        </div>
        
        <button 
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          style={{
            display: { xs: "flex", md: "none" },
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "8px"
          }}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{
              color: "#1f2937"
            }}
          >
            <path 
              d="M3 12H21M3 6H21M3 18H21" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      
      {isMenuOpen && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "16px 24px",
          backgroundColor: "#f9fafb",
          position: "absolute",
          left: 0,
          right: 0,
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
        }}>
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              style={{
                textDecoration: "none",
                color: "#1f2937",
                fontWeight: "500",
                fontSize: "16px",
                padding: "8px 0"
              }}
            >
              {link.name}
            </a>
          ))}
          <button 
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "8px 16px",
              fontWeight: "500",
              cursor: "pointer",
              marginTop: "8px"
            }}
          >
            Get Started
          </button>
        </div>
      )}
      
      <style>{
        `
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
        a:hover {
          color: #2563eb !important;
        }
        button:hover {
          background-color: #1d4ed8 !important;
        }
        `
      }</style>
    </nav>
  );
};

// render(<ModernNavbar />);
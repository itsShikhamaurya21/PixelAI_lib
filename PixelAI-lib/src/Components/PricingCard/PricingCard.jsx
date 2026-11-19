import React, { useState } from "react";

function PricingCards() {
  const [yearly, setYearly] = useState(false);

  const plans = [
    {
      name: "Basic",
      price: 0,
      color: "#0EA5E9",
      light: "#E0F2FE",
      description: "Perfect for getting started",
      features: ["5 Projects", "Basic Components", "Email Support", "Basic Analytics"]
    },
    {
      name: "Pro",
      price: 19,
      color: "#7C3AED",
      light: "#EDE9FE",
      description: "For professionals and creators",
      popular: true,
      features: ["Unlimited Projects", "Premium Components", "Priority Support", "Advanced Analytics", "Custom Themes"]
    },
    {
      name: "Business",
      price: 49,
      color: "#EA580C",
      light: "#FFEDD5",
      description: "For growing businesses",
      features: ["Everything in Pro", "Team Collaboration", "24/7 Support", "Custom Branding", "API Access"]
    }
  ];

  const container = {
    minHeight: "100vh",
    background: "#F1F5F9",
    padding: "65px 20px",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box"
  };

  return (
    <div style={container}>
      <div style={{ maxWidth: "1100px", margin: "auto" }}>

        <div style={{ textAlign: "center", marginBottom: "45px" }}>
          <span style={{
            background: "#DBEAFE",
            color: "#1D4ED8",
            padding: "9px 20px",
            borderRadius: "30px",
            fontSize: "13px",
            fontWeight: "bold"
          }}>
            SIMPLE & TRANSPARENT PRICING
          </span>

          <h1 style={{
            color: "#172554",
            fontSize: "clamp(30px, 5vw, 46px)",
            margin: "25px 0 12px",
            fontWeight: "800"
          }}>
            Choose Your Perfect Plan
          </h1>

          <p style={{
            color: "#64748B",
            fontSize: "16px",
            lineHeight: "1.7"
          }}>
            Flexible pricing plans designed to help you grow.
          </p>

          <div style={{
            display: "inline-flex",
            background: "#FFFFFF",
            padding: "6px",
            borderRadius: "40px",
            marginTop: "22px",
            boxShadow: "0 4px 15px rgba(15,23,42,0.08)"
          }}>
            <button
              onClick={() => setYearly(false)}
              style={{
                border: "none",
                padding: "12px 24px",
                borderRadius: "30px",
                background: !yearly ? "#172554" : "transparent",
                color: !yearly ? "#FFFFFF" : "#475569",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Monthly
            </button>

            <button
              onClick={() => setYearly(true)}
              style={{
                border: "none",
                padding: "12px 24px",
                borderRadius: "30px",
                background: yearly ? "#172554" : "transparent",
                color: yearly ? "#FFFFFF" : "#475569",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Yearly
            </button>
          </div>

          <p style={{
            color: "#16A34A",
            fontSize: "13px",
            fontWeight: "bold",
            marginTop: "10px"
          }}>
            Save 20% with yearly billing
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
          gap: "25px",
          alignItems: "stretch"
        }}>
          {plans.map((plan) => {
            const price = yearly ? plan.price * 0.8 : plan.price;

            return (
              <div
                key={plan.name}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "20px",
                  padding: "30px",
                  boxSizing: "border-box",
                  border: plan.popular
                    ? "2px solid #7C3AED"
                    : "1px solid #E2E8F0",
                  boxShadow: plan.popular
                    ? "0 15px 40px rgba(124,58,237,0.15)"
                    : "0 8px 25px rgba(15,23,42,0.06)",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {plan.popular && (
                  <div style={{
                    background: "#7C3AED",
                    color: "#FFFFFF",
                    padding: "9px 15px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: "bold",
                    position: "absolute",
                    top: "-15px",
                    right: "20px"
                  }}>
                    ★ MOST POPULAR
                  </div>
                )}

                <div style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: plan.light,
                  color: plan.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "25px",
                  fontWeight: "bold",
                  marginBottom: "20px"
                }}>
                  {plan.name === "Basic" ? "🚀" : plan.name === "Pro" ? "⚡" : "👑"}
                </div>

                <h2 style={{
                  color: "#172554",
                  fontSize: "25px",
                  margin: "0 0 10px",
                  fontWeight: "800"
                }}>
                  {plan.name}
                </h2>

                <p style={{
                  color: "#64748B",
                  fontSize: "14px",
                  margin: "0 0 25px"
                }}>
                  {plan.description}
                </p>

                <div style={{ marginBottom: "25px" }}>
                  <span style={{
                    color: "#0F172A",
                    fontSize: "45px",
                    fontWeight: "800"
                  }}>
                    ${price.toFixed(2)}
                  </span>

                  <span style={{ color: "#64748B", fontSize: "14px" }}>
                    / month
                  </span>

                  {yearly && plan.price > 0 && (
                    <p style={{
                      color: "#16A34A",
                      fontSize: "12px",
                      fontWeight: "bold"
                    }}>
                      Billed ${(price * 12).toFixed(2)} annually
                    </p>
                  )}
                </div>

                <button
                  onClick={() => alert(plan.name + " plan selected!")}
                  style={{
                    width: "100%",
                    padding: "15px",
                    border: "none",
                    borderRadius: "10px",
                    background: plan.color,
                    color: "#FFFFFF",
                    fontSize: "15px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0 5px 12px rgba(0,0,0,0.12)"
                  }}
                >
                  Choose {plan.name} →
                </button>

                <div style={{
                  height: "1px",
                  background: "#E2E8F0",
                  margin: "28px 0"
                }} />

                <h4 style={{
                  color: "#172554",
                  fontSize: "14px",
                  margin: "0 0 18px"
                }}>
                  What's included
                </h4>

                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "17px"
                }}>
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "11px",
                        color: "#475569",
                        fontSize: "14px"
                      }}
                    >
                      <span style={{
                        background: plan.light,
                        color: plan.color,
                        width: "23px",
                        height: "23px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        flexShrink: 0
                      }}>
                        ✓
                      </span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <p style={{
          textAlign: "center",
          color: "#64748B",
          fontSize: "13px",
          marginTop: "40px"
        }}>
          Need a custom solution? Contact our team.
        </p>
      </div>
    </div>
  );
}

export default PricingCards;
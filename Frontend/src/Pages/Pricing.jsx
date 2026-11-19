
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiZap,
  FiCheck,
  FiStar,
  FiCreditCard,
} from "react-icons/fi";

function Pricing() {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Starter",
      price: "Free",
      credits: "1500 Credits",
      description: "Perfect for exploring PixelAI.",
      features: [
        "1500 AI Credits",
        "AI component generation",
        "Live component preview",
        "Save private components",
        "Copy generated code",
      ],
      button: "Current Plan",
      popular: false,
      comingSoon: false,
    },
    {
      name: "Pro",
      price: "₹199",
      credits: "3000 Credits",
      description: "For developers building projects.",
      features: [
        "3,000 AI Credits",
        "Everything in Starter",
        "Save components",
        "Advanced AI generation",
        "Access component library",
      ],
      button: "Coming Soon",
      popular: true,
      comingSoon: true,
    },
  ];

  return (
    <div
      className="min-h-screen text-white relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0a0a1a 0%, #0d0d28 60%, #0a1628 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Glow Effects */}
      <div
        className="absolute top-[-8%] left-[10%] w-80 h-80 rounded-full pointer-events-none opacity-20"
        style={{
          background:
            "radial-gradient(circle, #6366f1 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      <div
        className="absolute bottom-[-6%] right-[5%] w-72 h-72 rounded-full pointer-events-none opacity-15"
        style={{
          background:
            "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-14">

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/generate")}
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-all mb-10 cursor-pointer bg-transparent border-none"
        >
          <FiArrowLeft size={15} />
          Back
        </motion.button>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
            style={{
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.25)",
            }}
          >
            <FiZap size={13} className="text-indigo-400" />
            <span className="text-xs font-semibold tracking-widest uppercase text-indigo-300">
              AI Credits
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold mb-5 tracking-tight">
            Build More with{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg,#818cf8 0%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              PixelAI
            </span>
          </h1>

          <p className="text-white/40 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Get more AI credits and build beautiful React components
            faster. Choose a plan that fits your development needs.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.12 }}
              whileHover={!plan.comingSoon ? { y: -6 } : {}}
              className="relative rounded-2xl p-6 md:p-8 flex flex-col"
              style={{
                background: plan.popular
                  ? "linear-gradient(180deg,rgba(99,102,241,0.14),rgba(255,255,255,0.03))"
                  : "rgba(255,255,255,0.03)",
                border: plan.popular
                  ? "1px solid rgba(129,140,248,0.5)"
                  : "1px solid rgba(255,255,255,0.08)",
                boxShadow: plan.popular
                  ? "0 0 35px rgba(99,102,241,0.08)"
                  : "none",
              }}
            >
              {/* Plan Badge */}
              {plan.popular && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap"
                  style={{
                    background:
                      "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    color: "#ffffff",
                  }}
                >
                  <FiStar size={12} />
                  Most Popular
                </div>
              )}

              {/* Plan Name */}
              <div className="mb-5 mt-2">
                <h2 className="text-xl font-semibold mb-2">
                  {plan.name}
                </h2>

                <p className="text-sm text-white/40">
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-5">
                <h3 className="text-4xl font-bold mb-2">
                  {plan.price}
                </h3>

                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{
                    background: "rgba(99,102,241,0.12)",
                    border: "1px solid rgba(99,102,241,0.2)",
                  }}
                >
                  <FiZap size={13} className="text-indigo-400" />
                  <span className="text-sm font-medium text-indigo-300">
                    {plan.credits}
                  </span>
                </div>
              </div>

              {/* Button */}
              <button
                type="button"
                onClick={() =>
                  !plan.comingSoon && navigate("/generate")
                }
                disabled={plan.comingSoon}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all mb-6 ${
                  plan.comingSoon
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:opacity-90 active:scale-[0.98] cursor-pointer"
                }`}
                style={{
                  background: plan.popular
                    ? "linear-gradient(135deg,#6366f1,#7c3aed)"
                    : "rgba(255,255,255,0.06)",
                  border: plan.popular
                    ? "1px solid transparent"
                    : "1px solid rgba(255,255,255,0.1)",
                  color: "#ffffff",
                }}
              >
                {plan.name === "Starter" ? (
                  <FiZap size={13} />
                ) : (
                  <FiCreditCard size={15} />
                )}

                {plan.button}
              </button>

              {/* Features */}
              <div className="border-t border-white/[0.07] pt-5">
                <p className="text-xs uppercase tracking-wider text-white/30 font-semibold mb-4">
                  What's included
                </p>

                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-3"
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{
                          background: "rgba(16,185,129,0.12)",
                        }}
                      >
                        <FiCheck
                          size={12}
                          className="text-emerald-400"
                        />
                      </div>

                      <span className="text-sm text-white/65">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-white/30">
            Pro plan is coming soon. More plans and features
            will be available in the future.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Pricing;

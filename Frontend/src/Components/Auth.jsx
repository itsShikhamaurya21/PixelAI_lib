
import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import axios from "axios";

import {
  TbX,
  TbMail,
  TbLock,
  TbUser,
  TbEye,
  TbEyeOff,
  TbArrowRight,
  TbSparkles,
  TbLogin2,
  TbSettings,
  TbCopy,
  TbDownload,
} from "react-icons/tb";

import { SiValorant } from "react-icons/si";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";

const ServerUrl = import.meta.env.VITE_SERVER_URL;

const steps = [
  {
    icon: TbLogin2,
    title: "Create Your Account",
    desc: "Sign in to access your personalized PixelAI workspace.",
  },
  {
    icon: TbSparkles,
    title: "Get 150 AI Credits",
    desc: "Start generating AI-powered UI components.",
  },
  {
    icon: TbSettings,
    title: "Customize Components",
    desc: "Adjust component properties to match your needs.",
  },
  {
    icon: TbCopy,
    title: "Generate UI",
    desc: "Create React components using your prompts.",
  },
  {
    icon: TbDownload,
    title: "Export Your Code",
    desc: "Copy and download your generated components.",
  },
];

function Auth({ onClose }) {
  const [active, setActive] = useState(0);
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const dispatch = useDispatch();

  const handleAuth = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (isSignup && !name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const endpoint = isSignup
        ? "/api/auth/register"
        : "/api/auth/login";

      const payload = isSignup
        ? {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
          }
        : {
            email: email.trim().toLowerCase(),
            password,
          };

      const result = await axios.post(
        `${ServerUrl}${endpoint}`,
        payload,
        {
          withCredentials: true,
        }
      );

      // Save authenticated user in Redux
      dispatch(setUserData(result.data.user));

      setSuccess(
        isSignup
          ? "Account created successfully!"
          : "Login successful!"
      );

      setTimeout(() => {
        onClose?.();
      }, 500);
    } catch (err) {
      console.error("Authentication error:", err);

      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsSignup((prev) => !prev);
    setError("");
    setSuccess("");
    setPassword("");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-md sm:p-5"
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.3 }}
          className="relative flex max-h-[94vh] w-full max-w-[900px] flex-col overflow-hidden rounded-2xl border border-[#3be8ff]/15 shadow-2xl sm:flex-row"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close authentication"
            className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <TbX size={19} />
          </button>

          {/* Left panel */}
          <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#03181c] to-[#041e24] p-8 sm:block sm:w-[45%] sm:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col">
              {/* Logo */}
              <div className="mb-12 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#3be8ff] to-[#0ab5d4] shadow-lg shadow-cyan-400/20">
                  <SiValorant size={19} color="#051c20" />
                </div>

                <span className="text-2xl font-bold tracking-tight text-white">
                  PixelAI
                </span>
              </div>

              <p className="mb-4 text-[10px] font-bold uppercase tracking-[3px] text-[#3be8ff]">
                HOW IT WORKS
              </p>

              <h2 className="mb-7 text-2xl font-bold leading-snug text-white">
                Build better UI.
                <br />
                <span className="text-[#3be8ff]">
                  Build faster.
                </span>
              </h2>

              <div className="flex flex-col gap-3">
                {steps.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = active === index;

                  return (
                    <motion.div
                      key={index}
                      onClick={() => setActive(index)}
                      whileHover={{ x: 3 }}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                        isActive
                          ? "border-cyan-300/20 bg-cyan-300/[0.08]"
                          : "border-transparent bg-white/[0.02] hover:bg-white/[0.05]"
                      }`}
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          isActive
                            ? "bg-cyan-300/15 text-cyan-300"
                            : "bg-white/5 text-white/40"
                        }`}
                      >
                        <Icon size={18} />
                      </div>

                      <div>
                        <p
                          className={`text-xs font-semibold ${
                            isActive
                              ? "text-white"
                              : "text-white/55"
                          }`}
                        >
                          {item.title}
                        </p>

                        {isActive && (
                          <p className="mt-1 text-[10px] leading-relaxed text-white/50">
                            {item.desc}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-auto pt-8">
                <p className="text-xs text-white/30">
                  AI-powered React component generation.
                </p>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="relative flex min-h-[540px] flex-1 items-center justify-center overflow-y-auto bg-[#040f12] px-5 py-12 sm:px-10">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(59,232,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(59,232,255,0.025)_1px,transparent_1px)] bg-[size:32px_32px]" />

            <div className="relative z-10 w-full max-w-[340px]">
              {/* Mobile logo */}
              <div className="mb-9 flex items-center justify-center gap-2 sm:hidden">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#3be8ff] to-[#0ab5d4]">
                  <SiValorant size={17} color="#051c20" />
                </div>
                <span className="text-xl font-bold text-white">
                  PixelAI
                </span>
              </div>

              {/* Heading */}
              <div className="mb-7 text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
                  <TbSparkles size={25} />
                </div>

                <h2 className="text-2xl font-bold text-white">
                  {isSignup ? "Create Account" : "Welcome Back"}
                </h2>

                <p className="mt-2 text-sm text-[#96bec8]/60">
                  {isSignup
                    ? "Create your account and start building."
                    : "Sign in to continue to your PixelAI workspace."}
                </p>
              </div>

              {/* Error message */}
              {error && (
                <div
                  role="alert"
                  className="mb-4 rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-300"
                >
                  {error}
                </div>
              )}

              {/* Success message */}
              {success && (
                <div
                  role="status"
                  className="mb-4 rounded-lg border border-green-400/20 bg-green-400/10 px-3 py-2 text-xs text-green-300"
                >
                  {success}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleAuth} className="space-y-4">
                {isSignup && (
                  <div>
                    <label className="mb-2 block text-xs font-medium text-white/70">
                      Full Name
                    </label>

                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-3.5 transition focus-within:border-cyan-300/50">
                      <TbUser className="text-white/35" size={18} />

                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                        className="w-full bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-white/25"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-xs font-medium text-white/70">
                    Email Address
                  </label>

                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-3.5 transition focus-within:border-cyan-300/50">
                    <TbMail className="text-white/35" size={18} />

                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      className="w-full bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-white/25"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-medium text-white/70">
                      Password
                    </label>

                    
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-3.5 transition focus-within:border-cyan-300/50">
                    <TbLock className="text-white/35" size={18} />

                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete={
                        isSignup ? "new-password" : "current-password"
                      }
                      className="w-full bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-white/25"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="text-white/40 transition hover:text-cyan-300"
                    >
                      {showPassword ? (
                        <TbEyeOff size={19} />
                      ) : (
                        <TbEye size={19} />
                      )}
                    </button>
                  </div>

                  {isSignup && (
                    <p className="mt-2 text-[10px] text-white/35">
                      Use at least 8 characters.
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3be8ff] to-[#0ab5d4] py-3.5 text-sm font-bold text-[#03181c] shadow-lg shadow-cyan-400/10 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Please wait..."
                    : isSignup
                      ? "Create Account"
                      : "Sign In"}

                  {!loading && <TbArrowRight size={18} />}
                </motion.button>
              </form>

              {/* Toggle */}
              <div className="mt-6 text-center">
                <p className="text-xs text-white/45">
                  {isSignup
                    ? "Already have an account?"
                    : "Don't have an account?"}

                  <button
                    type="button"
                    onClick={switchMode}
                    className="ml-1.5 font-semibold text-cyan-300 transition hover:text-cyan-200"
                  >
                    {isSignup ? "Sign In" : "Create Account"}
                  </button>
                </p>
              </div>

              <div className="mt-7 border-t border-white/[0.07] pt-5 text-center">
                <p className="text-[10px] leading-relaxed text-white/30">
                  By continuing, you agree to PixelAI's Terms of
                  Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Auth;


import React, { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiZap,
  FiCpu,
  FiPlus,
  FiAlertCircle,
  FiArrowRight,
  FiLoader,
  FiCheckCircle,
  FiX,
  FiCode,
  FiLayers,
  FiSave,
  FiUploadCloud,
  FiArrowLeft,
  FiRefreshCw,
  FiPackage,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { setUserData } from "../redux/userSlice";
import LiveComponentPreview from "../Components/LiveComponentPreview.jsx";

const ServerUrl = import.meta.env.VITE_SERVER_URL;

const SAVE_COMPONENT_URL = `${ServerUrl}/api/components`;

const PUBLISH_COMPONENT_URL = (id) =>
  `${ServerUrl}/api/components/${id}/publish`;

// Toast Notification
const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -40 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -40 }}
    transition={{ duration: 0.2 }}
    style={{
      background:
        type === "error"
          ? "rgba(239,68,68,0.95)"
          : type === "success"
          ? "rgba(16,185,129,0.95)"
          : "rgba(99,102,241,0.95)",
      color: "white",
      minWidth: "220px",
    }}
    className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl"
  >
    {type === "success" ? (
      <FiCheckCircle size={18} />
    ) : (
      <FiAlertCircle size={18} />
    )}

    <p className="text-sm font-medium">{message}</p>

    <button
      type="button"
      onClick={onClose}
      className="ml-auto text-white/80 hover:text-white"
      aria-label="Close notification"
    >
      <FiX size={16} />
    </button>
  </motion.div>
);

function Generate() {
  const userData = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userRole = userData?.role;
  const aiCredits = userData?.aiCredits ?? 0;

  const lowCredits = userRole === "user" && aiCredits < 50;

  const [prompt, setPrompt] = useState("");
  const [generated, setGenerated] = useState(null);
  const [generating, setGenerating] = useState(false);

  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("preview");
  const [copied, setCopied] = useState(false);

  const [savedComponentId, setSavedComponentId] = useState(null);
  const [publishedComponentId, setPublishedComponentId] = useState(null);

  const [isSaving, setIsSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  // Generate AI Component
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showToast("Please enter a component description.", "error");
      return;
    }

    if (lowCredits) {
      showToast("You need at least 50 credits.", "error");
      return;
    }

    if (generating) return;

    if (!ServerUrl) {
      showToast("Server URL is not configured.", "error");
      return;
    }

    setGenerating(true);
    setToast(null);
    setCopied(false);

    try {
      const { data } = await axios.post(
        `${ServerUrl}/api/ai/generate`,
        { prompt: prompt.trim() },
        { withCredentials: true }
      );

      if (!data.component?.code || typeof data.component.code !== "string") {
        showToast("AI did not return valid React code.", "error");
        return;
      }

      setGenerated(data.component);
      setActiveTab("preview");

      // Reset Save and Publish status
      setSavedComponentId(null);
      setPublishedComponentId(null);

      // Update Redux Credits
      if (typeof data.remainingCredits === "number") {
        dispatch(
          setUserData({
            ...userData,
            aiCredits: data.remainingCredits,
          })
        );
      }

      showToast("Component generated successfully!", "success");
    } catch (error) {
      console.error("AI Generation Error:", error);

      showToast(
        error.response?.data?.message ||
          "Failed to generate component. Please try again.",
        "error"
      );
    } finally {
      setGenerating(false);
    }
  };

  // Ctrl + Enter Shortcut
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleGenerate();
    }
  };

  // Copy Generated Code
  const handleCopyCode = async () => {
    if (!generated?.code) return;

    try {
      await navigator.clipboard.writeText(generated.code);

      setCopied(true);
      showToast("Code copied successfully!", "success");

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy error:", error);
      showToast("Unable to copy code.", "error");
    }
  };

  // Save Component - Admin and User Both
  const handleSaveComponent = async () => {
    if (!generated?.code) {
      showToast("Generate a component before saving.", "error");
      return;
    }

    if (savedComponentId || isSaving) return;

    if (!ServerUrl) {
      showToast("Server URL is not configured.", "error");
      return;
    }

    setIsSaving(true);

    try {
      const { data } = await axios.post(
        SAVE_COMPONENT_URL,
        {
          name: generated.name,
          description: generated.description || "",
          category: generated.category || "Other",
          prompt: prompt.trim(),
          code: generated.code,
          visibility: "private",
        },
        { withCredentials: true }
      );

      const componentId =
        data.component?._id ||
        data.component?.id ||
        data._id ||
        data.id;

      if (!componentId) {
        throw new Error(
          "Component was saved, but the API did not return its ID."
        );
      }

      setSavedComponentId(componentId);

      showToast("Component saved successfully!", "success");
    } catch (error) {
      console.error("Save Component Error:", error);

      showToast(
        error.response?.data?.message ||
          error.message ||
          "Unable to save component.",
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Publish Component - Admin Only
  const handlePublishComponent = async () => {
    if (userRole !== "admin") {
      showToast("Only admins can publish components.", "error");
      return;
    }

    if (!savedComponentId) {
      showToast("Please save the component first.", "error");
      return;
    }

    if (publishing || publishedComponentId) return;

    if (!ServerUrl) {
      showToast("Server URL is not configured.", "error");
      return;
    }

    setPublishing(true);

    try {
      const { data } = await axios.patch(
        PUBLISH_COMPONENT_URL(savedComponentId),
        {},
        { withCredentials: true }
      );

      const publishedId =
        data.component?._id ||
        data.component?.id ||
        savedComponentId;

      setPublishedComponentId(publishedId);

      showToast("Component published successfully!", "success");
    } catch (error) {
      console.error("Publish Component Error:", error);

      showToast(
        error.response?.data?.message ||
          "Unable to publish component.",
        "error"
      );
    } finally {
      setPublishing(false);
    }
  };

  // Generate a New Component
  const handleGenerateNew = () => {
    setGenerated(null);
    setSavedComponentId(null);
    setPublishedComponentId(null);
    setActiveTab("preview");
    setCopied(false);
    setToast(null);
  };

  return (
    <div
      className="min-h-screen text-white relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0a0a1a 0%, #0d0d28 60%, #0a1628 100%)",
      }}
    >
      {/* Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow Effects */}
      <div
        className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full pointer-events-none opacity-20"
        style={{
          background:
            "radial-gradient(circle, #6366f1 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div
        className="absolute bottom-[-10%] right-[-5%] w-80 h-80 rounded-full pointer-events-none opacity-15"
        style={{
          background:
            "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">

        {/* Back to Home Button */}
<motion.button
  initial={{ opacity: 0, x: -12 }}
  animate={{ opacity: 1, x: 0 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => navigate("/")}
  className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-all mb-8 px-4 py-2 rounded-xl cursor-pointer"
  style={{
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
  }}
>
  <FiArrowLeft size={15} />
  Back 
</motion.button>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{
              background: "rgba(99,102,241,0.15)",
              border: "1px solid rgba(99,102,241,0.3)",
            }}
          >
            <FiCpu size={14} className="text-indigo-400" />
            <span className="text-xs font-semibold tracking-widest text-indigo-300 uppercase">
              AI Component Studio
            </span>
          </div>

          <h2
            className="text-5xl font-bold mb-3 leading-tight"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: "-0.03em",
            }}
          >
            <span className="text-white">Build With </span>
            <span
              style={{
                background:
                  "linear-gradient(135deg,#818cf8 0%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              AI
            </span>
          </h2>

          <p className="text-white/40 text-base max-w-md mx-auto">
            Describe your React component in plain English.
            Preview, save, and publish all in one place.
          </p>
        </motion.div>

        {/* Credits - Normal Users Only */}
        {userRole === "user" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="flex justify-end mb-4"
          >
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{
                background: lowCredits
                  ? "rgba(239,68,68,0.1)"
                  : "rgba(99,102,241,0.1)",
                border: `1px solid ${
                  lowCredits
                    ? "rgba(239,68,68,0.25)"
                    : "rgba(99,102,241,0.25)"
                }`,
              }}
            >
              <FiZap
                size={13}
                style={{
                  color: lowCredits ? "#ef4444" : "#6366f1",
                }}
              />

              <span
                className={`text-sm ${
                  lowCredits ? "text-red-400" : "text-indigo-300"
                }`}
              >
                {aiCredits} Credits
              </span>

              <button
                type="button"
                title="Buy more credits"
                onClick={() => navigate("/pricing")}
                className="flex items-center justify-center w-5 h-5 rounded-md cursor-pointer border-none"
                style={{
                  background: lowCredits
                    ? "rgba(239,68,68,0.2)"
                    : "rgba(99,102,241,0.2)",
                }}
              >
                <FiPlus
                  size={11}
                  style={{
                    color: lowCredits ? "#f87171" : "#818cf8",
                  }}
                />
              </button>
            </div>
          </motion.div>
        )}

        {/* Low Credits Warning */}
        {userRole === "user" && lowCredits && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-5"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
            }}
          >
            <FiAlertCircle
              size={18}
              className="shrink-0"
              style={{ color: "#ef4444" }}
            />

            <p className="text-sm text-red-300">
              You need at least{" "}
              <span className="font-bold text-red-400">50 credits</span>{" "}
              to generate a component.
            </p>

            <button
              type="button"
              onClick={() => navigate("/pricing")}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border-none whitespace-nowrap"
              style={{
                background: "rgba(239,68,68,0.2)",
                color: "#f87171",
              }}
            >
              Buy credits <FiArrowRight size={12} />
            </button>
          </motion.div>
        )}

        {/* Prompt Box */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-1 mb-8"
          style={{
            background: "rgba(99,102,241,0.1)",
            border: `1px solid ${
              lowCredits
                ? "rgba(239,68,68,0.2)"
                : "rgba(99,102,241,0.2)"
            }`,
            opacity: lowCredits ? 0.6 : 1,
          }}
        >
          <div className="flex items-start gap-3 p-4">
            <FiZap
              className="text-indigo-400 mt-1 shrink-0"
              size={20}
            />

            <textarea
              onKeyDown={handleKeyDown}
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              disabled={lowCredits || generating}
              placeholder={
                lowCredits
                  ? "Not enough credits to generate..."
                  : "A glassmorphism pricing card with a toggle for monthly/annual billing..."
              }
              rows={3}
              className="w-full bg-transparent text-white placeholder-white/20 text-[15px] resize-none outline-none leading-relaxed disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex items-center justify-between px-4 pb-3">
            <span className="text-xs text-white/30">
              Ctrl + Enter to generate
            </span>

            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              disabled={generating || lowCredits || !prompt.trim()}
              onClick={handleGenerate}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              style={{
                background: generating
                  ? "rgba(99,102,241,0.3)"
                  : "linear-gradient(135deg, #6366f1 0%, #6f46e5 100%)",
                boxShadow: generating
                  ? "none"
                  : "0 4px 6px rgba(0,0,0,0.1)",
              }}
            >
              {generating ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                    className="inline-block"
                  >
                    <FiLoader size={15} />
                  </motion.span>
                  Generating...
                </>
              ) : (
                <>
                  <FiZap size={15} />
                  Generate
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Generated Component */}
        <AnimatePresence>
          {generated && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* Component Header */}
              <div
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b"
                style={{
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: "rgba(99,102,241,0.2)",
                    }}
                  >
                    <FiLayers size={15} className="text-indigo-400" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      {generated.name}
                    </p>

                    <p className="text-xs text-white/40">
                      {generated.description ||
                        "Generated React component"}
                    </p>
                  </div>
                </div>

                {/* Preview and Code Tabs */}
                <div
                  className="flex gap-1 rounded-xl p-1"
                  style={{ background: "rgba(0,0,0,0.3)" }}
                >
                  {["preview", "code"].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg capitalize"
                      style={{
                        background:
                          activeTab === tab
                            ? "rgba(99,102,241,0.2)"
                            : "transparent",
                        color:
                          activeTab === tab ? "#818cf8" : "#ffffff",
                      }}
                    >
                      {tab === "preview" ? (
                        <FiLayers size={15} />
                      ) : (
                        <FiCode size={15} />
                      )}
                      <span className="text-sm">{tab}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Tab */}
              {activeTab === "preview" && (
                <div className="p-5">
                  <LiveComponentPreview code={generated.code} />
                </div>
              )}

              {/* Code Tab */}
              {activeTab === "code" && (
                <div className="p-5">
                  <div className="flex justify-end mb-3">
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{
                        background: copied
                          ? "rgba(16,185,129,0.2)"
                          : "rgba(99,102,241,0.2)",
                        color: copied ? "#34d399" : "#a5b4fc",
                      }}
                    >
                      {copied ? "✓ Copied!" : "Copy Code"}
                    </button>
                  </div>

                  <pre className="overflow-x-auto rounded-xl p-4 text-sm text-green-300 bg-black/40">
                    <code>{generated.code}</code>
                  </pre>
                </div>
              )}

              {/* Save Component - Both User and Admin */}
              {(userRole === "user" || userRole === "admin") && (
                <div className="flex items-center gap-3 px-5 pb-5 pt-1 flex-wrap">
                  {/* Save Component */}
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveComponent}
                    disabled={
                      isSaving ||
                      !!savedComponentId ||
                      !generated?.code
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: savedComponentId
                        ? "rgba(16,185,129,0.1)"
                        : "rgba(99,102,241,0.1)",
                      border: savedComponentId
                        ? "1px solid rgba(16,185,129,0.3)"
                        : "1px solid rgba(99,102,241,0.3)",
                      color: savedComponentId ? "#10b981" : "#818cf8",
                    }}
                  >
                    {isSaving ? (
                      <FiLoader className="animate-spin" size={14} />
                    ) : savedComponentId ? (
                      <FiCheckCircle size={14} />
                    ) : (
                      <FiSave size={14} />
                    )}

                    {isSaving
                      ? "Saving..."
                      : savedComponentId
                      ? "Saved"
                      : "Save Component"}
                  </motion.button>

                  {/* Publish Component - Admin Only */}
                  {userRole === "admin" && (
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePublishComponent}
                      disabled={
                        publishing ||
                        !!publishedComponentId ||
                        !savedComponentId
                      }
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        background: publishedComponentId
                          ? "rgba(16,185,129,0.1)"
                          : "linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)",
                        border: publishedComponentId
                          ? "1px solid rgba(16,185,129,0.3)"
                          : "1px solid transparent",
                        color: publishedComponentId
                          ? "#10b981"
                          : "#ffffff",
                      }}
                    >
                      {publishing ? (
                        <FiLoader className="animate-spin" size={14} />
                      ) : publishedComponentId ? (
                        <FiCheckCircle size={14} />
                      ) : (
                        <FiUploadCloud size={14} />
                      )}

                      {publishing
                        ? "Publishing..."
                        : publishedComponentId
                        ? "Published"
                        : "Publish Component"}
                    </motion.button>
                  )}
                </div>
              )}

              {/* Published Status - Admin Only */}
              {userRole === "admin" && publishedComponentId && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 mx-5 mb-5 px-4 py-3 rounded-xl text-sm font-semibold"
                  style={{
                    background: "rgba(16,185,129,0.1)",
                    border: "1px solid rgba(16,185,129,0.3)",
                    color: "#10b981",
                  }}
                >
                  <FiCheckCircle size={14} />
                  Component published successfully!
                </motion.div>
              )}

              {/* Back, Generate New, My Components */}
              {(userRole === "user" || userRole === "admin") && (
                <div className="flex items-center justify-end gap-3 px-5 pb-5 flex-wrap">
                  {/* Back */}
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.8)",
                    }}
                  >
                    <FiArrowLeft size={14} />
                    Back
                  </motion.button>

                  {/* Generate New */}
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={handleGenerateNew}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background:
                        "linear-gradient(135deg,#6366f1 0%, #4f46e5 100%)",
                      boxShadow: "0 0 20px rgba(99,102,241,0.3)",
                      color: "#ffffff",
                    }}
                  >
                    <FiRefreshCw size={14} />
                    Generate New
                  </motion.button>

                  {/* My Components */}
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate("/my-components")}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: "rgba(99,102,241,0.15)",
                      border: "1px solid rgba(99,102,241,0.3)",
                      color: "#818cf8",
                    }}
                  >
                    <FiPackage size={14} />
                    My Components
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!generated && !generating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.2)",
              }}
            >
              <FiCpu size={28} className="text-indigo-400" />
            </div>

            <p className="text-white/30 text-sm">
              Describe your component above and hit Generate.
            </p>
          </motion.div>
        )}

        {/* Loading State */}
        {generating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 1,
                ease: "linear",
              }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.2)",
              }}
            >
              <FiLoader size={28} className="text-indigo-400" />
            </motion.div>

            <p className="text-white/40 text-sm">
              Generating your component...
            </p>
          </motion.div>
        )}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Generate;

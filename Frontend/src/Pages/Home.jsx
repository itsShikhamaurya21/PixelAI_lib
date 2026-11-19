
import React, { useState, useEffect } from "react";
import axios from "axios";
import Auth from "../Components/Auth.jsx";

import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice.js";

import { useNavigate } from "react-router-dom";
import { SiValorant } from "react-icons/si";

import { AnimatePresence, motion } from "framer-motion";

import {
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

import {
  TbComponents,
  TbCopy,
  TbCheck,
  TbArrowRight,
  TbLayout,
  TbAdjustments,
  TbCode,
  TbBrandNpm,
  TbPlayerPlay,
} from "react-icons/tb";

import { HiSparkles } from "react-icons/hi2";

const ServerUrl = import.meta.env.VITE_SERVER_URL;


// =====================================================
// FEATURES
// =====================================================

const features = [
  {
    icon: TbLayout,
    title: "Prebuilt UI Components",
    text: "Install PixelAI and use ready-made, production-grade components instantly.",
  },
  {
    icon: HiSparkles,
    title: "AI Component Generator",
    text: "Describe your UI in plain English and generate React components in seconds.",
  },
  {
    icon: TbAdjustments,
    title: "Customizable Props",
    text: "Modify component props and preview changes in real-time without rebuilding.",
  },
  {
    icon: TbCode,
    title: "Clean JSX Code",
    text: "Copy production-ready JSX directly into your project with zero boilerplate.",
  },
  {
    icon: TbBrandNpm,
    title: "NPM Library",
    text: "Import PixelAI components with a simple npm install command.",
  },
  {
    icon: TbPlayerPlay,
    title: "Live Preview",
    text: "Instantly preview AI-generated components before exporting your code.",
  },
];


// =====================================================
// STEPS
// =====================================================

const steps = [
  {
    n: "01",
    title: "Install Library",
    text: "npm install pixelai-lib to access all prebuilt UI components.",
  },
  {
    n: "02",
    title: "Use Components",
    text: "Import and customize with props for any design requirement.",
  },
  {
    n: "03",
    title: "Generate with AI",
    text: "Describe your UI and let AI build the component for you.",
  },
  {
    n: "04",
    title: "Copy & Use",
    text: "Paste the clean JSX code straight into your React project.",
  },
];


// =====================================================
// HOME COMPONENT
// =====================================================

function Home() {
  const [showAuth, setShowAuth] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);


  // =====================================================
  // REDUX
  // =====================================================

  const { userData } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();


  // =====================================================
  // ADMIN REDIRECT
  // =====================================================

  useEffect(() => {
    if (userData?.role === "admin") {
      navigate("/admin");
    }
  }, [userData, navigate]);


  // =====================================================
  // GET USER INITIALS
  // =====================================================

  const getLetters = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };


  // =====================================================
  // GENERATE COMPONENT
  // =====================================================

  const handleGenerateComponent = () => {
    if (!userData) {
      setShowAuth(true);
      setMenuOpen(false);
      return;
    }

    navigate("/generate");
    setMenuOpen(false);
  };


  // =====================================================
  // GET STARTED
  // =====================================================

  const handleGetStarted = () => {
    if (!userData) {
      setShowAuth(true);
      return;
    }

    navigate("/components");
    setMenuOpen(false);
  };


  // =====================================================
  // COPY NPM COMMAND
  // =====================================================

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        "npm install pixelai-lib"
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch (error) {
      console.error("Copy failed:", error);
    }
  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);

      const response = await axios.get(
        `${ServerUrl}/api/auth/logout`,
        {
          withCredentials: true,
        }
      );

      console.log("Logout response:", response.data);

      dispatch(setUserData(null));
      setProfileOpen(false);
      setMenuOpen(false);

    } catch (error) {
      console.error("Logout error:", error);

      if (error.response) {
        console.error(
          "Backend error:",
          error.response.data
        );
      }

    } finally {
      setLogoutLoading(false);
    }
  };


  // =====================================================
  // NAVIGATION HELPER
  // =====================================================

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
    setProfileOpen(false);
  };


  // =====================================================
  // JSX
  // =====================================================

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-[#030b0d] text-white"
      style={{
        fontFamily: "'DM', sans-serif",
      }}
    >

      {/* <Card></Card> */}

      {/* =================================================
          BACKGROUND
      ================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle,rgba(59,232,255,0.06)_0%,transparent_70%)]" />


      {/* =================================================
          NAVBAR
      ================================================== */}

      <nav className="sticky top-0 z-40 border-b border-white/[0.05] bg-[#030b0d]/85 px-3 py-3 backdrop-blur-md sm:px-8 sm:py-4 lg:px-10">

        <div className="flex items-center justify-between gap-3">


          {/* =================================================
              LOGO
          ================================================== */}

          <div className="flex shrink-0 items-center gap-2.5">

            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#3be8ff] to-[#0ab5d4] shadow-[0_0_14px_rgba(59,232,255,0.4)]">

              <SiValorant
                size={15}
                color="#051c20"
              />

            </div>

            <div
              className="text-lg font-bold tracking-tight"
              style={{
                fontFamily: "'Syne', sans-serif",
              }}
            >
              PixelAI
            </div>

          </div>


          {/* =================================================
              DESKTOP NAV
          ================================================== */}

          <div className="hidden items-center gap-3 sm:flex sm:gap-4 lg:gap-8">


            {/* COMPONENTS */}

            <button
              type="button"
              onClick={() => handleNavigate("/components")}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white/70 transition-all hover:border-white/30 hover:text-white sm:px-4 lg:px-6"
            >

              <TbComponents size={17} />

              <span>
                Components
              </span>

            </button>





            {/* =================================================
                PROFILE
            ================================================== */}

            {userData ? (

              <div className="relative">

                <motion.button
                  type="button"
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                  onClick={() =>
                    setProfileOpen((prev) => !prev)
                  }
                  className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-2 py-1 transition-all hover:border-[#3be8ff]/30 sm:gap-2.5 sm:px-3"
                >

                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#3be8ff] to-[#0ab5d4] text-[11px] font-bold text-[#030b0d]">

                    {getLetters(userData.name)}

                  </div>

                  <span className="max-w-[80px] truncate text-sm font-medium text-white/80 sm:max-w-[100px]">

                    {userData.name}

                  </span>

                </motion.button>


                {/* PROFILE DROPDOWN */}

                <AnimatePresence>

                  {profileOpen && (

                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 8,
                        scale: 0.96,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: 6,
                        scale: 0.96,
                      }}
                      transition={{
                        duration: 0.18,
                      }}
                      className="absolute right-0 top-12 z-50 w-60 overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0a1a1e] shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
                    >


                      {/* USER INFO */}

                      <div className="border-b border-white/[0.07] px-4 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#3be8ff] to-[#0ab5d4] text-sm font-bold text-[#030b0d]">

                            {getLetters(userData.name)}

                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-sm font-semibold text-white">

                              {userData.name}

                            </p>

                            <p className="truncate text-xs text-white/40">

                              {userData.email}

                            </p>

                          </div>

                        </div>

                      </div>


                      {/* MY COMPONENTS */}

                      <div className="border-b border-white/[0.07] py-1.5">

                        <button
                          type="button"
                          onClick={() => handleNavigate("/my-components")}
                          className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-sm text-white/60 transition-colors hover:bg-white/[0.04] hover:text-white"
                        >

                          <TbComponents
                            size={17}
                            className="text-[#3be8ff]/70"
                          />

                          <span>
                            My Components
                          </span>

                        </button>

                      </div>


                      {/* LOGOUT */}

                      <div className="p-2">

                        <button
                          type="button"
                          onClick={handleLogout}
                          disabled={logoutLoading}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                            logoutLoading
                              ? "cursor-not-allowed text-red-400/40"
                              : "cursor-pointer text-red-400/80 hover:bg-red-400/[0.08] hover:text-red-400"
                          }`}
                        >

                          <FiLogOut size={16} />

                          <span>
                            {logoutLoading
                              ? "Logging out..."
                              : "Logout"}
                          </span>

                        </button>

                      </div>

                    </motion.div>

                  )}

                </AnimatePresence>

              </div>

            ) : (

              /* LOGIN */

              <motion.button
                type="button"
                onClick={() => setShowAuth(true)}
                whileHover={{
                  scale: 1.03,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="cursor-pointer rounded-xl border border-[#3be8ff]/20 bg-[#3be8ff]/10 px-3 py-2.5 text-sm font-medium text-[#3be8ff] transition-all hover:border-[#3be8ff]/40 hover:bg-[#3be8ff]/15"
              >
                Login
              </motion.button>

            )}

          </div>


          {/* =================================================
              MOBILE MENU BUTTON
          ================================================== */}

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/80 transition-all hover:border-[#3be8ff]/30 hover:text-[#3be8ff] sm:hidden"
          >

            {menuOpen ? (
              <FiX size={21} />
            ) : (
              <FiMenu size={21} />
            )}

          </button>

        </div>


        {/* =================================================
            MOBILE MENU
        ================================================== */}

        <AnimatePresence>

          {menuOpen && (

            <motion.div
              initial={{
                opacity: 0,
                height: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                height: "auto",
                y: 0,
              }}
              exit={{
                opacity: 0,
                height: 0,
                y: -10,
              }}
              transition={{
                duration: 0.2,
              }}
              className="overflow-hidden sm:hidden"
            >

              <div className="mt-4 border-t border-white/[0.06] pt-4">


                {/* COMPONENTS */}

                <button
                  type="button"
                  onClick={() => handleNavigate("/components")}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/70 transition-all hover:bg-white/[0.05] hover:text-white"
                >

                  <TbComponents
                    size={18}
                    className="text-[#3be8ff]/70"
                  />

                  <span>
                    Components
                  </span>

                </button>


                


                {/* LOGGED IN */}

                {userData ? (

                  <div className="mt-3 border-t border-white/[0.06] pt-3">


                    {/* USER INFO */}

                    <div className="flex items-center gap-3 rounded-xl px-4 py-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#3be8ff] to-[#0ab5d4] text-sm font-bold text-[#030b0d]">

                        {getLetters(userData.name)}

                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-semibold text-white">

                          {userData.name}

                        </p>

                        <p className="truncate text-xs text-white/40">

                          {userData.email}

                        </p>

                      </div>

                    </div>


                    {/* MY COMPONENTS */}

                    <button
                      type="button"
                      onClick={() => handleNavigate("/my-components")}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 transition-all hover:bg-white/[0.05] hover:text-white"
                    >

                      <TbComponents
                        size={18}
                        className="text-[#3be8ff]/70"
                      />

                      <span>
                        My Components
                      </span>

                    </button>


                    {/* LOGOUT */}

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={logoutLoading}
                      className={`mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all ${
                        logoutLoading
                          ? "cursor-not-allowed text-red-400/40"
                          : "cursor-pointer text-red-400/80 hover:bg-red-400/[0.08] hover:text-red-400"
                      }`}
                    >

                      <FiLogOut size={17} />

                      <span>
                        {logoutLoading
                          ? "Logging out..."
                          : "Logout"}
                      </span>

                    </button>

                  </div>

                ) : (

                  /* LOGIN */

                  <motion.button
                    type="button"
                    onClick={() => {
                      setShowAuth(true);
                      setMenuOpen(false);
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    className="mt-3 flex w-full cursor-pointer items-center justify-center rounded-xl border border-[#3be8ff]/20 bg-[#3be8ff]/10 px-4 py-3 text-sm font-medium text-[#3be8ff]"
                  >

                    Login

                  </motion.button>

                )}

              </div>

            </motion.div>

          )}

        </AnimatePresence>

      </nav>


      {/* =================================================
          HERO
      ================================================== */}

      <main className="relative z-10">


        <section className="mx-auto max-w-5xl px-4 pt-12 text-center sm:px-6 sm:pt-20 md:pt-24">


          {/* =================================================
              BADGE
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 22,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.05,
              duration: 0.6,
            }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#3be8ff]/20 bg-[#3be8ff]/[0.05] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[2px] text-[#3be8ff]/70 sm:mb-7 sm:px-4 sm:text-[10px] sm:tracking-[2.5px]"
          >

            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3be8ff]" />

            <span>
              AI-Powered React UI Library
            </span>

          </motion.div>


          {/* =================================================
              HEADING
          ================================================== */}

          <motion.h1
            initial={{
              opacity: 0,
              y: 22,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.12,
              duration: 0.6,
            }}
            className="mb-6 text-3xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
            style={{
              fontFamily: "'Syne', sans-serif",
            }}
          >

            Build React UI

            <br />

            <span className="bg-gradient-to-r from-[#3be8ff] to-[#0ab5d4] bg-clip-text text-transparent">

              Faster with AI

            </span>

          </motion.h1>


          {/* =================================================
              DESCRIPTION
          ================================================== */}

          <motion.p
            initial={{
              opacity: 0,
              y: 22,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
              duration: 0.6,
            }}
            className="mx-auto max-w-xl px-2 text-sm font-light leading-relaxed text-white/50 sm:text-base md:text-lg"
          >

            Use prebuilt PixelAI components
            or generate custom ones with AI.
            Copy clean JSX directly into your
            project in seconds.

          </motion.p>


          {/* =================================================
              NPM COMMAND
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 22,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.27,
              duration: 0.6,
            }}
            className="mt-7 flex justify-center px-3 sm:mt-8 sm:px-0"
          >

            <div className="flex w-full max-w-sm items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 font-mono text-[11px] sm:w-auto sm:max-w-fit sm:px-5 sm:text-sm">

              <span className="shrink-0 text-[#3be8ff]/60">
                $
              </span>

              <span className="min-w-0 flex-1 truncate text-white/80 sm:flex-none">
                npm install pixelai-lib
              </span>

              <button
                type="button"
                onClick={handleCopy}
                title="Copy command"
                aria-label="Copy npm command"
                className="ml-1 flex shrink-0 cursor-pointer border-none bg-transparent text-white/30 transition-colors hover:text-[#3be8ff]"
              >

                {copied ? (

                  <TbCheck
                    size={16}
                    className="text-[#3be8ff]"
                  />

                ) : (

                  <TbCopy size={16} />

                )}

              </button>

            </div>

          </motion.div>


          {/* =================================================
              HERO BUTTONS
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 22,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.35,
              duration: 0.6,
            }}
            className="mt-6 flex flex-col justify-center gap-3 px-3 sm:flex-row sm:px-0"
          >


            {/* GET STARTED */}

            <motion.button
              type="button"
              onClick={handleGetStarted}
              whileHover={{
                scale: 1.04,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-[#030b0d] shadow-[0_0_25px_rgba(59,232,255,0.2)] transition-all hover:shadow-[0_0_40px_rgba(59,232,255,0.4)] sm:w-auto"
            >

              <span>
                Get Started
              </span>

              <TbArrowRight size={16} />

            </motion.button>


            {/* GENERATE AI */}

            <motion.button
              type="button"
              onClick={handleGenerateComponent}
              whileHover={{
                scale: 1.04,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-7 py-3.5 text-sm font-medium text-white/70 transition-all hover:border-white/20 hover:bg-white/[0.07] hover:text-white sm:w-auto"
            >

              <HiSparkles size={15} />

              <span>
                Generate AI Components
              </span>

            </motion.button>

          </motion.div>


          {/* =================================================
              LOGIN HINT
          ================================================== */}

          {!userData && (

            <motion.p
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.8,
              }}
              className="mt-5 px-2 text-xs text-white/25"
            >

              Login to start creating your
              own AI-powered components.

            </motion.p>

          )}


          {/* =================================================
              CODE PREVIEW
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 33,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.5,
              duration: 0.7,
            }}
            className="mx-auto mt-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a1a1e]/80 p-3 text-left shadow-[0_30px_60px_rgba(0,0,0,0.4)] backdrop-blur-sm sm:mt-16 sm:p-5"
          >


            {/* WINDOW HEADER */}

            <div className="mb-4 flex items-center gap-1.5">

              <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />

              <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />

              <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />

              <span className="ml-3 font-mono text-[11px] text-white/20">
                App.jsx
              </span>

            </div>


            {/* CODE */}

            <div className="min-w-0 overflow-x-auto font-mono text-[10px] leading-6 sm:text-[12.5px]">

              <div className="min-w-[340px]">

                <p>

                  <span className="text-[#c792ea]">
                    import
                  </span>{" "}

                  <span className="text-white">
                    {"{ Button, Card }"}
                  </span>{" "}

                  <span className="text-[#c792ea]">
                    from
                  </span>{" "}

                  <span className="text-[#c3e88d]">
                    'pixelai-lib'
                  </span>

                  <span className="text-white">
                    ;
                  </span>

                </p>


                <p className="mt-2">

                  <span className="text-[#c792ea]">
                    function
                  </span>{" "}

                  <span className="text-[#82aaff]">
                    App
                  </span>

                  <span className="text-white">
                    () {"{"}
                  </span>

                </p>


                <p className="pl-4">

                  <span className="text-[#c792ea]">
                    return
                  </span>{" "}

                  <span className="text-white">
                    (
                  </span>

                </p>


                <p className="pl-8">

                  <span className="text-white">
                    {"<div className="}
                  </span>

                  <span className="text-[#c3e88d]">
                    "space-y-4"
                  </span>

                  <span className="text-white">
                    {">"}
                  </span>

                </p>


                <p className="pl-12">

                  <span className="text-white">
                    {"<Button>"}
                  </span>

                  <span className="text-[#ffcb6b]">
                    Get Started
                  </span>

                  <span className="text-white">
                    {"</Button>"}
                  </span>

                </p>


                <p className="pl-12">

                  <span className="text-white">
                    {"<Card>"}
                  </span>

                  <span className="text-[#89ddff]">
                    My Dashboard
                  </span>

                  <span className="text-white">
                    {"</Card>"}
                  </span>

                </p>


                <p className="pl-8">

                  <span className="text-white">
                    {"</div>"}
                  </span>

                </p>


                <p className="pl-4">

                  <span className="text-white">
                    {");"}
                  </span>

                </p>


                <p>

                  <span className="text-white">
                    {"}"}
                  </span>

                </p>


                <p>

                  <span className="text-[#c792ea]">
                    export
                  </span>{" "}

                  <span className="text-[#c792ea]">
                    default
                  </span>{" "}

                  <span className="text-[#82aaff]">
                    App
                  </span>

                  <span className="text-white">
                    ;
                  </span>

                </p>

              </div>
            </div>

          </motion.div>

        </section>


        {/* =================================================
            FEATURES SECTION
        ================================================== */}

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20 md:py-24">


          {/* SECTION HEADER */}

          <motion.div
            initial={{
              opacity: 0,
              y: 16,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.55,
            }}
            className="mb-9 text-center sm:mb-14"
          >

            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[3px] text-[#3be8ff]/60">

              What's inside

            </p>


            <h2
              className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl"
              style={{
                fontFamily: "'Syne', sans-serif",
              }}
            >

              Everything you need

            </h2>


            <p className="mx-auto mt-4 max-w-xl px-2 text-sm leading-relaxed text-white/40 sm:text-base">

              Everything you need to build beautiful
              React interfaces, from ready-made
              components to AI-powered generation.

            </p>

          </motion.div>


          {/* FEATURE CARDS */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {features.map(
              (item, index) => {

                const Icon = item.icon;

                return (

                  <motion.div
                    key={item.title}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.2,
                    }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.08,
                    }}
                    whileHover={{
                      y: -5,
                    }}
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-300 hover:border-[#3be8ff]/20 hover:bg-[#3be8ff]/[0.025] hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)] sm:p-6"
                  >


                    {/* GLOW */}

                    <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#3be8ff]/[0.06] blur-2xl transition-all duration-300 group-hover:bg-[#3be8ff]/[0.12]" />


                    {/* ICON */}

                    <div className="relative mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[#3be8ff]/15 bg-[#3be8ff]/[0.07] text-[#3be8ff] transition-all duration-300 group-hover:border-[#3be8ff]/30 group-hover:bg-[#3be8ff]/[0.12] group-hover:shadow-[0_0_20px_rgba(59,232,255,0.12)]">

                      <Icon size={21} />

                    </div>


                    {/* TITLE */}

                    <h3 className="mb-2 text-base font-semibold text-white">

                      {item.title}

                    </h3>


                    {/* DESCRIPTION */}

                    <p className="text-sm leading-6 text-white/40">

                      {item.text}

                    </p>


                    {/* BOTTOM ACCENT */}

                    <div className="mt-5 h-px w-0 bg-gradient-to-r from-[#3be8ff]/50 to-transparent transition-all duration-500 group-hover:w-full" />

                  </motion.div>

                );
              }
            )}

          </div>

        </section>


        {/* =================================================
            HOW IT WORKS
        ================================================== */}

        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20 md:py-24">

          <motion.div
            initial={{
              opacity: 0,
              y: 16,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.55,
            }}
            className="mb-9 text-center sm:mb-14"
          >

            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[3px] text-[#3be8ff]/60">

              Simple Process

            </p>

            <h2
              className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl"
              style={{
                fontFamily: "'Syne', sans-serif",
              }}
            >

              How it works

            </h2>

          </motion.div>


          <div className="relative grid grid-cols-2 gap-5 sm:gap-10 lg:grid-cols-4 lg:gap-6">

            {/* CONNECTING LINE */}

            <div className="pointer-events-none absolute left-[12%] right-[12%] top-7 hidden h-px bg-gradient-to-r from-transparent via-[#3be8ff]/30 to-transparent lg:block" />

            {steps.map((item, index) => (
              <motion.div
                key={item.n}
                initial={{
                  opacity: 0,
                  y: 16,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.55,
                }}
                className="group relative text-center"
              >

                {/* STEP NUMBER */}

                <div className="relative z-10 mx-auto mb-4 flex h-12 w-12 flex-col items-center justify-center rounded-2xl border border-[#3be8ff]/20 bg-gradient-to-br from-[#0e2528] to-[#071518] transition-all duration-300 group-hover:border-[#3be8ff]/50 group-hover:shadow-[0_0_25px_rgba(59,232,255,0.15)] sm:mb-5 sm:h-16 sm:w-16">

                  <span className="text-[13px] font-semibold text-[#3be8ff] sm:text-sm">
                    {item.n}
                  </span>

                </div>


                {/* TITLE */}

                <h3 className="mb-2 text-sm font-semibold text-white sm:text-base">
                  {item.title}
                </h3>


                {/* DESCRIPTION */}

                <p className="mx-auto max-w-[190px] break-words text-[11px] leading-relaxed text-white/40 sm:text-xs">
                  {item.text}
                </p>

              </motion.div>
            ))}

          </div>

        </section>


        {/* =================================================
            FINAL CTA
        ================================================== */}

        <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6 sm:pb-24">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-2xl border border-[#3be8ff]/15 bg-gradient-to-br from-[#071518] to-[#040f12] p-5 text-center sm:rounded-3xl sm:p-8 md:p-14"
          >

            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_0%,rgba(59,232,255,0.08)_0%,transparent_60%)]" />

            <div className="relative z-10">

              <p className="text-[10px] font-semibold tracking-[3px] uppercase text-[#3be8ff]/60 mb-3 sm:mb-4">
                Start Building
              </p>

              <h3
                className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Ready to generate <br />
                your new component?
              </h3>


              {/* LOGGED IN */}

              {userData ? (
                <>
                  <p className="text-white/40 mb-7 sm:mb-8 text-sm max-w-md mx-auto leading-relaxed">
                    Welcome back,{" "}
                    <span className="text-[#3be8ff]/70">
                      {userData.name}
                    </span>
                    ! Continue building amazing components.
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center gap-3">

                    {/* GENERATE AI */}

                    <motion.button
                      type="button"
                      onClick={() => handleNavigate("/generate")}
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex w-full sm:w-auto items-center justify-center gap-2 bg-[#3be8ff] text-[#030b0d] px-7 py-3.5 rounded-xl font-semibold text-sm cursor-pointer border-none shadow-[0_0_25px_rgba(59,232,255,0.3)] hover:shadow-[0_0_40px_rgba(59,232,255,0.45)] transition-shadow"
                    >
                      <HiSparkles size={14} />
                      Generate AI Component
                    </motion.button>


                    {/* MY COMPONENTS */}

                    <motion.button
                      type="button"
                      onClick={() => handleNavigate("/my-components")}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex w-full sm:w-auto items-center justify-center gap-2 px-7 py-3.5 border border-white/15 rounded-xl text-white/70 hover:text-white hover:border-white/25 transition-all cursor-pointer bg-transparent"
                    >
                      <TbComponents
                        size={16}
                        className="text-[#3be8ff]"
                      />
                      My Components
                    </motion.button>

                  </div>
                </>
              ) : (
                <>
                  <p className="text-white/40 mb-7 sm:mb-8 text-sm max-w-md mx-auto leading-relaxed">
                    Sign in with Google, get 150 free credits, and start
                    generating production-ready UI components instantly.
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center gap-3">

                    {/* GET STARTED FREE */}

                    <motion.button
                      type="button"
                      onClick={() => setShowAuth(true)}
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex w-full sm:w-auto items-center justify-center gap-2 bg-[#3be8ff] text-[#030b0d] px-7 py-3.5 rounded-xl font-semibold text-sm cursor-pointer border-none shadow-[0_0_25px_rgba(59,232,255,0.3)] hover:shadow-[0_0_40px_rgba(59,232,255,0.45)] transition-shadow"
                    >
                      <HiSparkles size={14} />
                      Get started Free
                    </motion.button>


                    {/* COMPONENTS */}

                    <motion.button
                      type="button"
                      onClick={() => handleNavigate("/components")}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex w-full sm:w-auto items-center justify-center gap-2 px-7 py-3.5 border border-white/15 rounded-xl text-white/70 hover:text-white hover:border-white/25 transition-all cursor-pointer bg-transparent"
                    >
                      <TbComponents
                        size={16}
                        className="text-[#3be8ff]"
                      />
                      Components
                    </motion.button>

                  </div>
                </>
              )}

            </div>
          </motion.div>
        </section>

      </main>


      {/* =================================================
          FOOTER
      ================================================== */}

      <footer className="relative z-10 border-t border-white/[0.06] bg-[#020809]">

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">

          {/* TOP FOOTER */}

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 sm:gap-10">


            {/* BRAND */}

            <div className="lg:col-span-2">

              <div className="flex items-center gap-2.5">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#3be8ff] to-[#0ab5d4] shadow-[0_0_16px_rgba(59,232,255,0.3)]">

                  <SiValorant
                    size={16}
                    color="#051c20"
                  />

                </div>

                <span
                  className="text-lg font-bold tracking-tight"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                  }}
                >
                  PixelAI
                </span>

              </div>

              <p className="mt-4 max-w-md text-sm leading-6 text-white/35">
                An AI-powered React UI library that helps you
                build, customize, and ship beautiful interfaces
                faster.
              </p>


              {/* STATUS */}

              <div className="mt-5 flex items-center gap-2">

                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3be8ff]" />

                <span className="text-xs text-white/30">
                  Built for modern React developers
                </span>

              </div>

            </div>


            {/* PRODUCT */}

            <div>

              <h4 className="mb-4 text-xs font-semibold uppercase tracking-[2px] text-white/70">
                Product
              </h4>

              <div className="flex flex-col gap-3">

                <button
                  type="button"
                  onClick={() => handleNavigate("/components")}
                  className="w-fit cursor-pointer text-sm text-white/35 transition-colors hover:text-[#3be8ff]"
                >
                  Components
                </button>

                <button
                  type="button"
                  onClick={handleGenerateComponent}
                  className="w-fit cursor-pointer text-sm text-white/35 transition-colors hover:text-[#3be8ff]"
                >
                  AI Generator
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate("/components")}
                  className="w-fit cursor-pointer text-sm text-white/35 transition-colors hover:text-[#3be8ff]"
                >
                  Getting Started
                </button>

              </div>

            </div>


            {/* RESOURCES */}

            <div>

              <h4 className="mb-4 text-xs font-semibold uppercase tracking-[2px] text-white/70">
                Resources
              </h4>

              <div className="flex flex-col gap-3">

                <button
                  type="button"
                  onClick={() => handleNavigate("/my-components")}
                  className="w-fit cursor-pointer text-sm text-white/35 transition-colors hover:text-[#3be8ff]"
                >
                  Documentation
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate("/components")}
                  className="w-fit cursor-pointer text-sm text-white/35 transition-colors hover:text-[#3be8ff]"
                >
                  Examples
                </button>

                <button
                  type="button"
                  onClick={() => window.open("https://github.com", "_blank", "noopener,noreferrer")}
                  className="w-fit cursor-pointer text-sm text-white/35 transition-colors hover:text-[#3be8ff]"
                >
                  GitHub
                </button>

              </div>

            </div>

          </div>


          {/* LOGIN CTA */}

          <div className="mt-10 overflow-hidden rounded-2xl border border-[#3be8ff]/10 bg-[#3be8ff]/[0.025] p-5 sm:mt-12 sm:p-8">

            <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">

              <div className="text-center sm:text-left">

                <h3 className="text-base font-semibold text-white">
                  Ready to build faster?
                </h3>

                <p className="mt-1 text-sm text-white/35">
                  Sign in and start creating AI-powered React components.
                </p>

              </div>

              <motion.button
                type="button"
                onClick={handleGetStarted}
                whileHover={{
                  y: -2,
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="flex w-full sm:w-auto shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#3be8ff] px-6 py-3 text-sm font-semibold text-[#030b0d] shadow-[0_0_20px_rgba(59,232,255,0.2)] transition-shadow hover:shadow-[0_0_30px_rgba(59,232,255,0.35)]"
              >

                <HiSparkles size={15} />

                Get Started

                <TbArrowRight size={16} />

              </motion.button>

            </div>

          </div>


          {/* DIVIDER */}

          <div className="my-7 h-px bg-white/[0.06] sm:my-8" />


          {/* BOTTOM */}

          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">

            <p className="text-xs text-white/25">
              © {new Date().getFullYear()} PixelAI. All rights reserved.
            </p>

            <div className="flex items-center gap-2 text-xs text-white/25">

              <span>
                Made with
              </span>

              <span className="text-[#3be8ff]">
                ♥
              </span>

              <span>
                for React developers
              </span>

            </div>

          </div>

        </div>

      </footer>


      {/* =================================================
          AUTH MODAL
      ================================================== */}

      {showAuth && (
        <Auth
          onClose={() => setShowAuth(false)}
        />
      )}

    </div>
  );
}

export default Home;

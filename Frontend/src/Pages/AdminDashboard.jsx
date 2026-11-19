
import React, { useState } from "react";
import axios from "axios";
import { SiValorant } from "react-icons/si";
import {
  TbChevronLeft,
  TbCode,
  TbLayoutDashboard,
  TbLogout,
  TbMenu,
  TbPackage,
  TbPlus,
  TbUsers,
  TbEye,
  TbTrash,
} from "react-icons/tb";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserData } from "../redux/userSlice.js";
import { AnimatePresence, motion } from "motion/react";
import LiveComponentPreview from "../Components/LiveComponentPreview.jsx";

const ServerUrl = import.meta.env.VITE_SERVER_URL;

// ---------------- CUSTOM TOOLTIP ----------------

function CustomToolTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-[#071619] border border-[#a78bfa]/30 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-white/50 text-xs mb-1">{label}</p>
      <p className="text-[#a78bfa] text-sm font-semibold">
        Components: {payload[0].value}
      </p>
    </div>
  );
}

// ---------------- PROPS INPUT ----------------

function PropsInput({ props, setProps }) {
  const [propInput, setPropInput] = useState("");

  const handleAddProp = () => {
    const newProp = propInput.trim();

    if (!newProp || props.includes(newProp)) return;

    setProps([...props, newProp]);
    setPropInput("");
  };

  const handleRemoveProp = (index) => {
    setProps(props.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-xs font-medium text-white/70 mb-2 uppercase">
        Props
      </label>

      <div className="flex gap-2">
        <input
          type="text"
          value={propInput}
          onChange={(e) => setPropInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddProp();
            }
          }}
          placeholder="Enter prop name (e.g. variant)"
          className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#3be8ff]/50"
        />

        <button
          type="button"
          onClick={handleAddProp}
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#3be8ff]/10 text-[#3be8ff] text-xs"
        >
          <TbPlus size={17} />
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {props.map((prop, index) => (
          <span
            key={index}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs text-[#3be8ff]"
          >
            {prop}

            <button
              type="button"
              onClick={() => handleRemoveProp(index)}
              className="text-red-400 hover:text-red-300"
            >
              <TbTrash size={14} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------------- ADD COMPONENT FORM ----------------

function AddComponentsForm({ onComponentAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    code: "",
    props: [],
    visibility: "public",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [toast, setToast] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setToast("");

    if (
      !formData.name.trim() ||
      !formData.category.trim() ||
      !formData.code.trim()
    ) {
      setError("Please fill in component name, category and code.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${ServerUrl}/api/components/create`,
        formData,
        { withCredentials: true }
      );

      // Refresh dashboard components
      await onComponentAdded?.();

      // Success toast
      setToast(
        response.data.message || "Component published successfully!"
      );

      window.setTimeout(() => {
        setToast("");
      }, 3000);

      // Reset form
      setFormData({
        name: "",
        description: "",
        category: "",
        code: "",
        props: [],
        visibility: "public",
      });

      setShowPreview(false);
      setShowCode(false);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to add component"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 max-w-3xl w-full mx-auto">

      {/* TOP SUCCESS / ERROR TOAST */}
      {(toast || error) && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-md">
          <div
            role={error ? "alert" : "status"}
            className={`rounded-xl border px-4 py-3 text-sm shadow-2xl ${
              error
                ? "border-red-400/30 bg-[#2a1010] text-red-400"
                : "border-green-400/30 bg-[#09251b] text-green-400"
            }`}
          >
            {error || toast}
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-base font-semibold text-white">
          Add New Component
        </h2>

        <p className="text-xs text-white/40 mt-2">
          Manually add a component, define its props, paste its code,
          preview it and publish it.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Component Name */}
        <div className="p-3 sm:p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] space-y-2">
          <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block">
            Component Name *
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Example: PrimaryButton"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#3be8ff]/50"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-white/70 mb-2">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Describe your component..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#3be8ff]/50 resize-none"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-white/70 mb-2">
            Category *
          </label>

          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Example: Buttons, Cards, Forms"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#3be8ff]/50"
          />
        </div>

        {/* Props */}
        <div className="p-3.5 sm:p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] space-y-2">
          <PropsInput
            props={formData.props}
            setProps={(newProps) =>
              setFormData((prev) => ({
                ...prev,
                props: newProps,
              }))
            }
          />
        </div>

        {/* Component Code with Code / Preview Icons */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/[0.07]">
            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
              Component Code *
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                title="View Code"
                aria-label="View Code"
                aria-pressed={!showPreview}
                onClick={() => {
                  setShowCode(true);
                  setShowPreview(false);
                }}
                className={`flex items-center justify-center w-9 h-8 rounded-lg transition-all ${
                  !showPreview
                    ? "bg-[#164e63] text-[#67e8f9]"
                    : "bg-white/[0.05] text-white/50 hover:bg-white/[0.10] hover:text-white"
                }`}
              >
                <TbCode size={18} />
              </button>

              <button
                type="button"
                title="Preview Code"
                aria-label="Preview Code"
                aria-pressed={showPreview}
                onClick={() => {
                  setShowPreview(true);
                  setShowCode(false);
                }}
                className={`flex items-center justify-center w-9 h-8 rounded-lg transition-all ${
                  showPreview
                    ? "bg-[#164e63] text-[#67e8f9]"
                    : "bg-white/[0.05] text-white/50 hover:bg-white/[0.10] hover:text-white"
                }`}
              >
                <TbEye size={18} />
              </button>
            </div>
          </div>

          {showPreview ? (
            <div className="bg-white p-3">
              <LiveComponentPreview code={formData.code} />
            </div>
          ) : (
            <textarea
              name="code"
              value={formData.code}
              onChange={handleChange}
              rows={12}
              placeholder="Paste your React component code here..."
              className="w-full bg-[#071619] border-0 px-4 py-4 text-sm text-[#3be8ff] placeholder:text-white/30 outline-none focus:ring-1 focus:ring-inset focus:ring-[#3be8ff]/40 resize-y font-mono"
            />
          )}
        </div>

        {/* Visibility */}
        <div>
          <label className="block text-xs font-medium text-white/70 mb-2">
            Visibility
          </label>

          <select
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
            className="w-full bg-[#071619] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#3be8ff]/50"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        {/* Publish Button */}
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#3be8ff] text-[#071619] text-xs font-semibold hover:bg-[#3be8ff]/90 disabled:opacity-50 transition-all"
          >
            <TbCode size={17} />
            {loading ? "Publishing..." : "Publish Component"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ---------------- ADMIN DASHBOARD ----------------

function AdminDashboard() {
  const [activeView, setActiveView] = useState("dashboard");
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshedComponents, setRefreshedComponents] = useState([]);

  const { userData, allUsers, allComponents } = useSelector(
    (s) => s.user
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Safely get components array
  const componentsArray = Array.isArray(allComponents)
    ? allComponents
    : Array.isArray(allComponents?.data)
    ? allComponents.data
    : Array.isArray(allComponents?.components)
    ? allComponents.components
    : Array.isArray(allComponents?.data?.components)
    ? allComponents.data.components
    : [];

  // Safely get users array
  const usersArray = Array.isArray(allUsers)
    ? allUsers
    : Array.isArray(allUsers?.data)
    ? allUsers.data
    : Array.isArray(allUsers?.users)
    ? allUsers.users
    : [];

  // Fetch latest public components after publishing
  const refreshComponents = async () => {
    try {
      const response = await axios.get(
        `${ServerUrl}/api/components/all-components`,
        { withCredentials: true }
      );

      const data = response.data;

      const latestComponents = Array.isArray(data)
        ? data
        : Array.isArray(data?.components)
        ? data.components
        : Array.isArray(data?.data?.components)
        ? data.data.components
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setRefreshedComponents(latestComponents);
    } catch (error) {
      console.error("Components refresh error:", error);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      setLogoutLoading(true);

      await axios.get(`${ServerUrl}/api/auth/logout`, {
        withCredentials: true,
      });

      dispatch(setUserData(null));
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLogoutLoading(false);
    }
  };

  // Merge Redux components with refreshed components
  const publicComponents = [
    ...new Map(
      [...componentsArray, ...refreshedComponents]
        .filter((component) => component?.visibility === "public")
        .map((component) => [component._id, component])
    ).values(),
  ];

  // Search components
  const filteredComponents = publicComponents.filter((component) => {
    const searchText = searchQuery.toLowerCase();

    return (
      component.name?.toLowerCase().includes(searchText) ||
      component.title?.toLowerCase().includes(searchText) ||
      component.description?.toLowerCase().includes(searchText)
    );
  });

  // Dashboard stats
  const stats = [
    {
      label: "Total Users",
      value: usersArray.length,
      icon: TbUsers,
      color: "#3be8ff",
    },
    {
      label: "Components Made",
      value: publicComponents.length,
      icon: TbCode,
      color: "#a78bfa",
    },
  ];

  // Date-wise component data
  const chartData = (() => {
    if (!publicComponents.length) return [];

    const map = {};

    publicComponents.forEach((component) => {
      if (!component.createdAt) return;

      const date = new Date(component.createdAt);

      if (Number.isNaN(date.getTime())) return;

      const key = date.toISOString().split("T")[0];
      map[key] = (map[key] || 0) + 1;
    });

    return Object.entries(map)
      .map(([date, count]) => ({
        date: new Date(`${date}T00:00:00`).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
          }
        ),
        components: count,
        sortDate: date,
      }))
      .sort((a, b) => a.sortDate.localeCompare(b.sortDate))
      .slice(-12);
  })();

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      Icon: TbLayoutDashboard,
    },
    {
      id: "add",
      label: "Add Component",
      Icon: TbPackage,
    },
  ];

  // Sidebar content
  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-white/[0.04]">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3be8ff] to-[#0ab5d4] flex items-center justify-center shadow-[0_0_14px_rgba(59,232,255,0.25)]">
          <SiValorant size={16} color="#062126" />
        </div>

        <div>
          <span className="text-sm font-bold block tracking-wide">
            PixelAI
          </span>
          <span className="text-[9px] text-[#3be8ff]/60 font-bold tracking-[2px] uppercase">
            Admin
          </span>
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="ml-auto md:hidden bg-transparent border-none cursor-pointer p-1.5 rounded-lg text-white/40 hover:text-white/70 transition-colors"
        >
          <TbChevronLeft size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-5 space-y-1">
        {navItems.map(({ id, label, Icon }) => {
          const isActive = activeView === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                setActiveView(id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-200 ${
                isActive
                  ? "bg-[#103034] text-[#3be8ff]"
                  : "text-gray-500 hover:bg-white/[0.04] hover:text-gray-200"
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/[0.05]">
        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutLoading}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <TbLogout size={17} />
          <span>
            {logoutLoading ? "Logging out..." : "Logout"}
          </span>
        </button>
      </div>
    </>
  );

  return (
    <div
      className="min-h-screen flex bg-[#02090b] text-white"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 z-20 flex-col h-screen w-60 bg-[#040f12] border-r border-white/[0.04]">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-[2px] md:hidden"
              onClick={() => setSidebarOpen(false)}
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="fixed top-0 left-0 z-40 flex flex-col w-64 h-screen bg-[#040e11] border-r border-white/[0.06] md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 min-h-screen md:ml-60 bg-[#02090b] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 bg-[#030b0d]/90 backdrop-blur-md border-b border-white/[0.06] flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden bg-transparent border-none cursor-pointer p-1.5 rounded-lg text-white/50 hover:text-white transition-all flex-shrink-0"
            >
              <TbMenu size={20} />
            </button>

            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold truncate">
                {activeView === "dashboard"
                  ? "Dashboard"
                  : "Add Component"}
              </h1>

              <p className="text-white/35 text-xs truncate">
                Welcome back, {userData?.name || "Admin"}
              </p>
            </div>
          </div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => navigate("/generate")}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold text-[#030b0d] bg-gradient-to-r from-[#3be8ff] to-[#0ab5d4] hover:opacity-90 transition-all shadow-[0_0_20px_rgba(59,232,255,0.2)] cursor-pointer border-none flex-shrink-0"
          >
            <TbPlus size={14} />
            <span className="hidden sm:inline">AI Component</span>
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {/* Dashboard View */}
          {activeView === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="px-4 sm:px-6 lg:px-8 py-5 space-y-4 sm:space-y-6"
            >
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                {stats.map(({ label, value, icon: Icon, color }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: i * 0.08,
                      duration: 0.4,
                    }}
                    className="p-3.5 sm:p-4 rounded-2xl border border-white/[0.05] bg-white/[0.02] hover:border-white/[0.12] transition-all"
                  >
                    <div
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center mb-2.5 sm:mb-3"
                      style={{
                        background: `${color}15`,
                        border: `1px solid ${color}25`,
                      }}
                    >
                      <Icon size={15} style={{ color }} />
                    </div>

                    <p className="text-xl sm:text-2xl font-bold">
                      {value.toLocaleString()}
                    </p>

                    <p className="text-white/40 text-xs mt-1">
                      {label}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Chart */}
              <motion.div className="p-4 sm:p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
                <div className="flex items-start sm:items-center justify-between mb-4 sm:mb-5 gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">
                      Public Components Published
                    </p>
                    <p className="text-white/35 text-xs mt-0.5">
                      Date-wise breakdown
                    </p>
                  </div>

                  <span className="text-[10px] font-semibold px-2 sm:px-2.5 py-1 rounded-full bg-[#a78bfa]/10 text-[#a78bfa] border border-[#a78bfa]/20 flex-shrink-0">
                    Last 12 dates
                  </span>
                </div>

                {chartData.length === 0 ? (
                  <div className="h-[180px] flex items-center justify-center text-white/30 text-sm">
                    No public components yet
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="componentGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#a78bfa"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#a78bfa"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.04)"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 10 }}
                      />

                      <YAxis
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 10 }}
                        width={25}
                      />

                      <Tooltip content={<CustomToolTip />} />

                      <Area
                        type="monotone"
                        dataKey="components"
                        stroke="#a78bfa"
                        strokeWidth={2.5}
                        fill="url(#componentGradient)"
                        dot={false}
                        activeDot={{
                          r: 5,
                          fill: "#a78bfa",
                          stroke: "#ffffff",
                          strokeWidth: 2,
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </motion.div>

              {/* Public Components */}
              <motion.div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 border-b border-white/[0.06]">
                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      Public Components
                    </h2>
                    <p className="text-xs text-white/35 mt-1">
                      Manage and explore published components
                    </p>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search components..."
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-2.5 pl-3 pr-4 text-xs text-white placeholder:text-white/30 outline-none focus:border-[#3be8ff]/50 transition-all"
                    />
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  {filteredComponents.length === 0 ? (
                    <div className="py-10 text-center">
                      <TbPackage
                        size={28}
                        className="mx-auto text-white/20 mb-2"
                      />

                      <p className="text-sm text-white/50">
                        {searchQuery
                          ? "No matching components found"
                          : "No public components yet"}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {filteredComponents.map((component) => (
                        <div
                          key={component._id}
                          className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#3be8ff]/30 transition-all"
                        >
                          <h3 className="text-sm font-semibold text-white">
                            {component.name ||
                              component.title ||
                              "Untitled Component"}
                          </h3>

                          <p className="text-xs text-white/40 mt-2 line-clamp-2">
                            {component.description ||
                              "No description available"}
                          </p>

                          <div className="flex items-center justify-between mt-4">
                            <span className="text-[10px] px-2 py-1 rounded-full bg-[#3be8ff]/10 text-[#3be8ff]">
                              Public
                            </span>

                            <span className="text-[10px] text-white/30">
                              {component.createdAt
                                ? new Date(
                                    component.createdAt
                                  ).toLocaleDateString()
                                : ""}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Add Component View */}
          {activeView === "add" && (
            <motion.div
              key="add"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="px-4 sm:px-6 lg:px-8"
            >
              <AddComponentsForm onComponentAdded={refreshComponents} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default AdminDashboard;

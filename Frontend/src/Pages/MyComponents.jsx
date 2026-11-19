
import React, { useState, useEffect } from "react";
import axios from "axios";
import { SiValorant } from "react-icons/si";
import {
  TbLayoutSidebarLeftExpand,
  TbSearch,
  TbMenu,
  TbX,
  TbCode,
  TbEye,
  TbBook,
  TbCopy,
  TbCheck,
  TbChevronRight,
} from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import LiveComponentPreview from "../Components/LiveComponentPreview.jsx";

const ServerUrl = import.meta.env.VITE_SERVER_URL;

// Copy to clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Unable to copy:", error);
    return false;
  }
}

// Copy Button
function CopyButton({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (await copyToClipboard(text)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? "Copied successfully" : label}
      className="flex items-center gap-1.5 text-xs text-white/40 hover:text-[#3be8ff] transition-colors shrink-0"
    >
      {copied ? (
        <TbCheck size={16} className="text-[#3be8ff]" />
      ) : (
        <>
          <TbCopy size={15} />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

// Code Box
function CodeBox({ code, label }) {
  return (
    <div className="rounded-xl bg-[#030b0d] border border-white/[0.06] overflow-hidden">
      {label && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
          <span className="text-[10px] uppercase tracking-wider text-white/30">
            {label}
          </span>
          <CopyButton text={code} />
        </div>
      )}

      <div className="p-4 overflow-x-auto">
        <pre className="whitespace-pre text-xs text-[#9be8b0] leading-6">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

// Welcome Guide
function GuidePanel() {
  const guideSteps = [
    {
      number: "01",
      title: "Explore Components",
      description: "Browse your private components in the sidebar.",
      icon: <TbLayoutSidebarLeftExpand size={20} />,
    },
    {
      number: "02",
      title: "Search Components",
      description: "Search for a component by its name.",
      icon: <TbSearch size={20} />,
    },
    {
      number: "03",
      title: "View Component Code",
      description: "Open Code View to explore and copy the source.",
      icon: <TbCode size={20} />,
    },
    {
      number: "04",
      title: "Preview & Learn",
      description: "See the live preview and usage guidance.",
      icon: <TbEye size={20} />,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12">
      <div className="text-center mb-12">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#3be8ff]/10 border border-[#3be8ff]/20 flex items-center justify-center mb-5 shadow-[0_0_25px_rgba(59,232,255,0.08)]">
          <SiValorant size={28} color="#3be8ff" />
        </div>

        <p className="text-xs tracking-[3px] uppercase text-[#3be8ff] mb-3">
          Welcome to PixelAI
        </p>

        <h1
          className="text-2xl sm:text-3xl font-bold text-white"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          My Components
        </h1>

        <p className="text-sm text-white/40 max-w-lg mx-auto mt-3 leading-7">
          Explore your private React components, preview their design,
          understand their code and reuse them in your projects.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {guideSteps.map((step) => (
          <div
            key={step.number}
            className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="text-[#3be8ff]">{step.icon}</div>
              <span className="text-[10px] text-[#3be8ff]/50">
                {step.number}
              </span>
              <h3 className="text-sm font-semibold text-white/80">
                {step.title}
              </h3>
            </div>

            <p className="text-xs text-white/35 leading-6">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-xl border border-[#3be8ff]/15 bg-[#3be8ff]/[0.04] flex items-start gap-3">
        <TbBook size={19} className="text-[#3be8ff] shrink-0 mt-0.5" />

        <div>
          <h3 className="text-xs font-semibold text-[#3be8ff]">
            Quick Tip
          </h3>

          <p className="text-xs text-white/40 mt-1 leading-6">
            Select any component from the sidebar to explore its source code,
            live preview, import statement and implementation guidance.
          </p>
        </div>
      </div>
    </div>
  );
}

// Sidebar
function SidebarComponent({
  myComponents,
  selected,
  onSelect,
  search,
  setSearch,
  loading,
  fetchError,
}) {
  const selectedId = selected?._id || selected?.id;

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="px-3 py-3 border-b border-white/[0.05]">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <TbSearch size={13} className="text-white/25 shrink-0" />

          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            className="bg-transparent text-xs text-white/70 placeholder:text-white/20 outline-none w-full"
          />
        </div>

        <div className="px-4 pt-3 pb-1.5">
          <p className="text-[9px] font-bold tracking-[2.5px] uppercase text-white/20">
            My Components · {myComponents.length}
          </p>
        </div>
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-y-auto py-1 px-2">
        {loading ? (
          <p className="text-white/30 text-xs text-center py-8">
            Loading components...
          </p>
        ) : fetchError ? (
          <p className="text-red-400 text-xs text-center py-8 px-3">
            {fetchError}
          </p>
        ) : myComponents.length === 0 ? (
          <p className="text-white/20 text-xs text-center py-8 px-3">
            {search
              ? "No matching components found"
              : "No private components yet"}
          </p>
        ) : (
          myComponents.map((c) => {
            const componentId = c._id || c.id || c.name;
            const isSelected = String(selectedId) === String(componentId);

            return (
              <button
                key={componentId}
                type="button"
                onClick={() => onSelect(c)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer border text-left mb-0.5"
                style={{
                  background: isSelected
                    ? "rgba(59,232,255,0.07)"
                    : "transparent",
                  borderColor: isSelected
                    ? "rgba(59,232,255,0.2)"
                    : "transparent",
                  color: isSelected
                    ? "#3be8ff"
                    : "rgba(255,255,255,0.5)",
                }}
              >
                <span className="truncate">{c.name}</span>

                {isSelected && (
                  <TbChevronRight size={13} className="shrink-0 ml-1" />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

// Main Page
function MyComponents() {
  const navigate = useNavigate();

  // API State
  const [myComponents, setMyComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // UI State
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("code");

  // Fetch logged-in user's components
  useEffect(() => {
    const fetchMyComponents = async () => {
      if (!ServerUrl) {
        setFetchError("Server URL is not configured.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setFetchError("");

        const { data } = await axios.get(
          `${ServerUrl}/api/components/my-components`,
          {
            withCredentials: true,
          }
        );

        const fetchedComponents = Array.isArray(data.components)
          ? data.components
          : Array.isArray(data.data)
          ? data.data
          : [];

        setMyComponents(fetchedComponents);
      } catch (error) {
        console.error("Fetch My Components Error:", error);

        setFetchError(
          error.response?.data?.message ||
            "Failed to load your components."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyComponents();
  }, []);

  // Search filter
  const filteredComponents = myComponents
    .filter((component) =>
      (component.name || "")
        .toLowerCase()
        .includes(search.toLowerCase().trim())
    )
    .sort((a, b) =>
      (a.name || "").localeCompare(b.name || "")
    );

  // Select Component
  const handleSelect = (component) => {
    setSelected(component);
    setActiveTab("code");
    setIsSidebarOpen(false);
  };

  // Back to guide
  const handleBack = () => {
    setSelected(null);
    setActiveTab("code");
  };

  // Usage example
  const fullUsageExample = selected
    ? `import ${selected.name} from "./${selected.name}";

function App() {
  return (
    <div>
      <${selected.name} />
    </div>
  );
}

export default App;`
    : "";

  // Sidebar props
  const sidebarProps = {
    myComponents: filteredComponents,
    selected,
    onSelect: handleSelect,
    search,
    setSearch,
    loading,
    fetchError,
  };

  return (
    <div
      className="min-h-screen bg-[#030b0d] text-white flex flex-col overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Navbar */}
      <nav className="sticky top-0 z-[60] flex items-center justify-between px-4 sm:px-8 py-3.5 sm:py-5 border-b border-white/[0.05] bg-[#030b0f]/90 backdrop-blur-md shrink-0">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 sm:gap-2.5 bg-transparent border-none cursor-pointer"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-[#3be8ff] to-[#0ab5d4] flex items-center justify-center shadow-[0_0_14px_rgba(59,232,255,0.35)]">
            <SiValorant size={13} color="#051c20" />
          </div>

          <span
            className="text-sm font-semibold sm:text-base text-white"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            PixelAI
          </span>
        </button>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 text-xs text-white/30">
            <TbLayoutSidebarLeftExpand size={14} />
            <span>My Components</span>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            aria-expanded={isSidebarOpen}
            className="sm:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            {isSidebarOpen ? <TbX size={18} /> : <TbMenu size={18} />}
          </button>
        </div>
      </nav>

      {/* Main Layout */}
      <div
        className="flex flex-1 overflow-hidden relative"
        style={{ height: "calc(100vh - 57px)" }}
      >
        {/* Desktop Sidebar */}
        <aside className="hidden sm:flex w-52 md:w-56 shrink-0 flex-col border-r border-white/[0.06] bg-[#040e11] overflow-hidden">
          <SidebarComponent {...sidebarProps} />
        </aside>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 top-[57px] z-40 bg-black/60 sm:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <aside
          className={`fixed top-[57px] left-0 bottom-0 z-50 w-64 bg-[#040e11] border-r border-white/[0.06] flex flex-col shadow-2xl transition-transform duration-300 sm:hidden ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarComponent {...sidebarProps} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-8">
          {selected ? (
            <div>
              {/* Back Button */}
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 text-xs text-[#3be8ff] hover:text-white transition-colors mb-5"
              >
                <TbBook size={15} />
                Back to Guide
              </button>

              {/* Component Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <p className="text-xs text-[#3be8ff] mb-2">
                    My Components / {selected.category || "Component"}
                  </p>

                  <h1
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {selected.name}
                  </h1>

                  <p className="text-sm text-white/40 mt-2">
                    {selected.description}
                  </p>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  {[
                    { id: "code", label: "Code", icon: <TbCode size={18} /> },
                    { id: "preview", label: "Preview", icon: <TbEye size={18} /> },
                    { id: "guidance", label: "Guide", icon: <TbBook size={16} /> },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3 h-9 flex items-center justify-center gap-1.5 rounded-lg border text-xs transition-all ${
                        activeTab === tab.id
                          ? "bg-[#3be8ff]/10 text-[#3be8ff] border-[#3be8ff]/30"
                          : "bg-white/[0.03] text-white/40 border-white/[0.06] hover:text-white"
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="mt-6 rounded-xl border border-white/[0.08] bg-[#071316] overflow-hidden">
                {/* Code Tab */}
                {activeTab === "code" && (
                  <div>
                    <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                      <span className="text-xs text-white/50">
                        {selected.name}.jsx
                      </span>

                      <CopyButton
                        text={selected.code || ""}
                        label="Copy Code"
                      />
                    </div>

                    <pre className="p-4 overflow-x-auto whitespace-pre text-xs text-[#b8e8ed] leading-6">
                      <code>{selected.code || "// No code available"}</code>
                    </pre>
                  </div>
                )}

                {/* Preview Tab */}
                {activeTab === "preview" && (
                  <div className="p-5 sm:p-8 min-h-[300px]">
                    <p className="text-xs text-white/40 mb-4">
                      Live Component Preview
                    </p>

                    {selected.code ? (
                      <LiveComponentPreview code={selected.code} />
                    ) : (
                      <p className="text-xs text-white/30">
                        No component code available for preview.
                      </p>
                    )}
                  </div>
                )}

                {/* Guide Tab */}
                {activeTab === "guidance" && (
                  <div className="p-5 sm:p-6 space-y-6">
                    <p className="text-[10px] font-bold tracking-[3px] uppercase text-[#3be8ff]/50">
                      Usage Guide
                    </p>

                    {/* Step 1 */}
                    <div>
                      <p className="text-xs font-semibold text-white/50 mb-3 flex items-center gap-2">
                        <TbCode size={13} />
                        <span className="text-[#3be8ff]">01</span>
                        Copy the component code
                      </p>

                      <CodeBox
                        code={selected.code || ""}
                        label="Component Code"
                      />
                    </div>

                    {/* Step 2 */}
                    <div>
                      <p className="text-xs font-semibold text-white/50 mb-3 flex items-center gap-2">
                        <TbCode size={13} />
                        <span className="text-[#3be8ff]">02</span>
                        Create a new file
                      </p>

                      <CodeBox
                        code={`${selected.name}.jsx`}
                        label="File Name"
                      />
                    </div>

                    {/* Step 3 */}
                    <div>
                      <p className="text-xs font-semibold text-white/50 mb-3 flex items-center gap-2">
                        <TbCode size={13} />
                        <span className="text-[#3be8ff]">03</span>
                        Import the component
                      </p>

                      <CodeBox
                        code={`import ${selected.name} from "./${selected.name}";`}
                        label="Import"
                      />
                    </div>

                    {/* Step 4 */}
                    <div>
                      <p className="text-xs font-semibold text-white/50 mb-3 flex items-center gap-2">
                        <TbCode size={13} />
                        <span className="text-[#3be8ff]">04</span>
                        Use the component
                      </p>

                      <CodeBox
                        code={fullUsageExample}
                        label="Usage Example"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <GuidePanel />
          )}
        </main>
      </div>
    </div>
  );
}

export default MyComponents;

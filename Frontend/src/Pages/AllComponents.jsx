
import React, { useState } from "react";
import { useSelector } from "react-redux";
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
  TbPackage,
  TbDownload,
  TbTerminal2,
} from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import LiveComponentPreview from "../Components/LiveComponentPreview.jsx";

// Change this if your actual published npm package has a different name.
const PACKAGE_NAME = "pixelai-lib";

// Copy Helper
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Unable to copy:", error);
    return false;
  }
}

// Reusable Copy Button
function CopyButton({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(text);

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={label}
      aria-label={label}
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

// Reusable Code Box
function CodeBox({ code, label, copyLabel = "Copy" })  {
  return (
    <div className="rounded-xl bg-[#030b0d] border border-white/[0.06] overflow-hidden">

      {/* Header */}
      {label && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
          <p className="text-[10px] uppercase tracking-wider text-white/30">
            {label}
          </p>

          <CopyButton text={code} label={copyLabel} />
        </div>
      )}

      {/* Code */}
      <div className="p-4 overflow-x-auto">
        <pre className="whitespace-pre text-xs text-[#9be8b0] leading-6">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

// Guide Panel Component
function GuidePanel() {
  const guideSteps = [
    {
      number: "01",
      title: "Explore Components",
      description:
        "Browse the public components available in the sidebar.",
      icon: <TbLayoutSidebarLeftExpand size={20} />,
    },
    {
      number: "02",
      title: "Search Components",
      description:
        "Use the search bar to quickly find a component by its name.",
      icon: <TbSearch size={20} />,
    },
    {
      number: "03",
      title: "View Component Code",
      description:
        "Open Code View to explore and copy the component source code.",
      icon: <TbCode size={20} />,
    },
    {
      number: "04",
      title: "Preview & Learn",
      description:
        "See the live component preview and check its usage guidance.",
      icon: <TbEye size={20} />,
    },
  ];

  const installCommand = `npm install ${PACKAGE_NAME}`;

  const libraryImport = `import { Button } from "${PACKAGE_NAME}";`;

  const usageExample = `import { Button } from "${PACKAGE_NAME}";

function App() {
  return (
    <div>
      <Button />
    </div>
  );
}

export default App;`;

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12">

      {/* Welcome Section */}
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
          Component Explorer
        </h1>

        <p className="text-sm text-white/40 max-w-lg mx-auto mt-3 leading-7">
          Explore ready-to-use React components, preview their design,
          understand their code and integrate them into your projects.
        </p>
      </div>

      {/* Guide Heading */}
      <div className="mb-5">
        <h2
          className="text-lg font-semibold text-white"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          How to get started?
        </h2>

        <p className="text-xs text-white/35 mt-1">
          Follow these simple steps to explore PixelAI.
        </p>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {guideSteps.map((step) => (
          <div
            key={step.number}
            className="p-5 rounded-xl bg-[#071316] border border-white/[0.07] hover:border-[#3be8ff]/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#3be8ff]/[0.08] text-[#3be8ff] flex items-center justify-center group-hover:bg-[#3be8ff]/15 transition-colors">
                {step.icon}
              </div>

              <span className="text-xs tracking-widest text-white/20">
                {step.number}
              </span>
            </div>

            <h3 className="text-sm font-semibold text-white mb-2">
              {step.title}
            </h3>

            <p className="text-xs text-white/40 leading-6">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* Install PixelAI Library */}
      <div className="mt-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#3be8ff]/[0.08] text-[#3be8ff] flex items-center justify-center">
            <TbPackage size={21} />
          </div>

          <div>
            <h2
              className="text-lg font-semibold text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Install PixelAI Library
            </h2>

            <p className="text-xs text-white/35 mt-1">
              Add PixelAI to your React project.
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-[#071316] border border-white/[0.07] p-5 space-y-4">
          <div>
            <p className="text-xs text-white/50 leading-6 mb-3">
              Open your React project terminal and run the following
              command to install the PixelAI library.
            </p>

            <CodeBox
              label="BASH"
              code={installCommand}
              copyLabel="Copy"
            />
          </div>

          <div className="flex items-start gap-2 text-xs text-white/35 leading-6">
            <TbTerminal2
              size={16}
              className="text-[#3be8ff] shrink-0 mt-1"
            />

            <p>
              Make sure you run this command inside your React
              project's root directory.
            </p>
          </div>
        </div>
      </div>

      {/* Import Components */}
      <div className="mt-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#3be8ff]/[0.08] text-[#3be8ff] flex items-center justify-center">
            <TbDownload size={21} />
          </div>

          <div>
            <h2
              className="text-lg font-semibold text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Import Components
            </h2>

            <p className="text-xs text-white/35 mt-1">
              Import and use PixelAI components in your application.
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-[#071316] border border-white/[0.07] p-5 space-y-5">

          {/* Step 1 */}
          <div>
            <p className="text-xs font-semibold text-white mb-2">
              Step 1. Import the required component
            </p>

            <p className="text-xs text-white/40 mb-3 leading-6">
              Import the component you want to use from the PixelAI
              library.
            </p>

            <CodeBox
              label="JS"
              code={libraryImport}
              copyLabel="Copy"
            />
          </div>

          {/* Step 2 */}
          <div>
            <p className="text-xs font-semibold text-white mb-2">
              Step 2. Use the component
            </p>

            <p className="text-xs text-white/40 mb-3 leading-6">
              Use the imported component inside your React application.
            </p>

            <CodeBox
              label="JSX"
              code={usageExample}
              copyLabel="Copy"
            />
          </div>
        </div>
      </div>

      {/* Quick Tip */}
      <div className="mt-8 p-4 rounded-xl border border-[#3be8ff]/15 bg-[#3be8ff]/[0.04] flex items-start gap-3">
        <TbBook
          size={19}
          className="text-[#3be8ff] shrink-0 mt-0.5"
        />

        <div>
          <h3 className="text-xs font-semibold text-[#3be8ff]">
            Quick Tip
          </h3>

          <p className="text-xs text-white/40 mt-1 leading-6">
            Select any component from the sidebar to explore its source
            code, live preview, component-specific import statement and
            implementation guidance.
          </p>
        </div>
      </div>
    </div>
  );
}

// Sidebar Component
function SidebarComponent({
  publicComponents,
  selected,
  onSelect,
  search,
  setSearch,
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
            Public . {publicComponents.length}
          </p>
        </div>
      </div>

      {/* Components List */}
      <div className="flex-1 overflow-y-auto py-1 px-2">
        {publicComponents.length === 0 ? (
          <p className="text-white/20 text-xs text-center py-8 px-3">
            No public Components yet
          </p>
        ) : (
          publicComponents.map((c) => {
            const componentId = c._id || c.id;
            const isSelected = selectedId === componentId;

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
                  <TbChevronRight
                    size={13}
                    className="shrink-0 ml-1"
                  />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

// Main Component
function AllComponents() {
  const navigate = useNavigate();

  const allComponents = useSelector(
    (state) => state.user?.allComponents
  );

  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("code");

  // Handle different API response structures
  const componentsArray = Array.isArray(allComponents)
    ? allComponents
    : Array.isArray(allComponents?.components)
    ? allComponents.components
    : Array.isArray(allComponents?.data)
    ? allComponents.data
    : [];

  // Filter and sort public components
  const publicComponents = componentsArray
    .filter((c) => c.visibility === "public")
    .filter((c) =>
      c.name?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      (a.name || "").localeCompare(b.name || "")
    );

  // Select component
  const handleSelect = (component) => {
    setSelected(component);
    setActiveTab("code");
    setIsSidebarOpen(false);
  };

  // Generate component import statement
  const importCommand = selected
    ? `import { ${selected.name} } from "${PACKAGE_NAME}";`
    : "";

  // Generate component usage example
  const usageCommand = selected
    ? `<${selected.name} />`
    : "";

  const fullUsageExample = selected
    ? `import { ${selected.name} } from "${PACKAGE_NAME}";

function App() {
  return (
    <div>
      <${selected.name} />
    </div>
  );
}

export default App;`
    : "";

  return (
    <div
      className="min-h-screen bg-[#030b0d] text-white flex flex-col overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Navbar */}
      <nav className="sticky top-0 z-[60] flex items-center justify-between px-4 sm:px-8 py-3.5 sm:py-5 border-b border-white/[0.05] bg-[#030b0f]/90 backdrop-blur-md shrink-0">

        {/* Logo */}
        <button
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

        {/* Navbar Right */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 text-xs text-white/30">
            <TbLayoutSidebarLeftExpand size={14} />
            <span>Component Explorer</span>
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
          <SidebarComponent
            publicComponents={publicComponents}
            selected={selected}
            onSelect={handleSelect}
            search={search}
            setSearch={setSearch}
          />
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
          <SidebarComponent
            publicComponents={publicComponents}
            selected={selected}
            onSelect={handleSelect}
            search={search}
            setSearch={setSearch}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-8">

          {selected ? (
                <div>
      {/* Back to Guide Button */}
      <button
        onClick={() => {
          setSelected(null);
          setActiveTab("code");
        }}
        className="flex items-center gap-2 text-xs text-[#3be8ff] hover:text-white transition-colors mb-5"
      >
        <TbBook size={15} />
        Back to Guide
      </button>
            
            <div>
              {/* Component Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                
                <div>
                  <p className="text-xs text-[#3be8ff] mb-2">
                    Component Explorer / {selected.category}
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
                

                {/* Three Icon Buttons */}
                <div className="flex items-center justify-end gap-2 shrink-0">

                  {/* Code View */}
                  <button
                    type="button"
                    onClick={() => setActiveTab("code")}
                    title="Code View"
                    aria-label="Code View"
                    className={`px-3 h-9 flex items-center justify-center gap-1.5 rounded-lg border transition-all ${
                      activeTab === "code"
                        ? "bg-[#3be8ff]/10 text-[#3be8ff] border-[#3be8ff]/30"
                        : "bg-white/[0.03] text-white/40 border-white/[0.06] hover:text-white"
                    }`}
                  >
                    <TbCode size={18} />
                    <span>Code</span>
                  </button>

                  {/* Preview */}
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    title="Preview Code"
                    aria-label="Preview Code"
                    className={`px-3 h-9 flex items-center justify-center gap-1.5 rounded-lg border transition-all ${
                      activeTab === "preview"
                        ? "bg-[#3be8ff]/10 text-[#3be8ff] border-[#3be8ff]/30"
                        : "bg-white/[0.03] text-white/40 border-white/[0.06] hover:text-white"
                    }`}
                  >
                    <TbEye size={18} /> <span>Preview</span>
                  </button>

                  {/* Guidance */}
                  <button
                    type="button"
                    onClick={() => setActiveTab("guidance")}
                    title="Guidance"
                    aria-label="Guidance"
                    className={`px-3 h-9 flex items-center justify-center gap-1.5 rounded-lg border transition-all ${
                      activeTab === "guidance"
                        ? "bg-[#3be8ff]/10 text-[#3be8ff] border-[#3be8ff]/30"
                        : "bg-white/[0.03] text-white/40 border-white/[0.06] hover:text-white"
                    }`}
                  >
                    <TbBook size={18} /> <span>Guide</span>
                  </button>
                </div>
              </div>
              </div>

              {/* Active Tab Content */}
              <div className="mt-6 rounded-xl border border-white/[0.08] bg-[#071316] overflow-hidden">

                {/* Code View */}
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

                    <pre className="p-4 overflow-x-auto text-xs text-[#b8e8ed] leading-6">
                      <code>
                        {selected.code || "// No code available"}
                      </code>
                    </pre>
                  </div>
                )}

                {/* Preview */}
                {activeTab === "preview" && (
                  <div className="p-5 sm:p-8 min-h-[300px]">
                    <div className="mb-4">
                      <p className="text-xs text-white/40">
                        Live Component Preview
                      </p>
                    </div>

                    {selected.code ? (
                      <LiveComponentPreview code={selected.code} />
                    ) : (
                      <p className="text-xs text-white/30">
                        No component code available for preview.
                      </p>
                    )}
                  </div>
                )}

                {/* Guidance */}
                {activeTab === "guidance" && (
                  <div className="p-5 sm:p-6 space-y-6">

                    {/* Library Installation */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <TbPackage
                          size={18}
                          className="text-[#3be8ff]"
                        />

                        <h3 className="text-sm font-semibold text-white">
                          Step 1: Install PixelAI Library
                        </h3>
                      </div>

                      <p className="text-xs text-white/45 mb-3 leading-6">
                        Install the PixelAI library in your React
                        project before importing this component.
                      </p>

                      <CodeBox
                        label="BASH"
                        code={`npm install ${PACKAGE_NAME}`}
                        copyLabel="Copy"
                      />
                    </div>

                    {/* Component Import */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <TbDownload
                          size={18}
                          className="text-[#3be8ff]"
                        />

                        <h3 className="text-sm font-semibold text-white">
                          Step 2: Import {selected.name}
                        </h3>
                      </div>

                      <p className="text-xs text-white/45 mb-3 leading-6">
                        Import the selected component directly from
                        the PixelAI library.
                      </p>

                      <CodeBox
                        label="JS"
                        code={importCommand}
                        copyLabel="Copy"
                      />
                    </div>

                    {/* Usage */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <TbCode
                          size={18}
                          className="text-[#3be8ff]"
                        />

                        <h3 className="text-sm font-semibold text-white">
                          Step 3: Use {selected.name} in React
                        </h3>
                      </div>

                      <p className="text-xs text-white/45 mb-3 leading-6">
                        Add the component inside your React application.
                      </p>

                      <CodeBox
                        label="JSX"
                        code={fullUsageExample}
                        copyLabel="Copy"
                      />

                      <div className="mt-3">
                        <CodeBox
                          label="JSX"
                          code={usageCommand}
                          copyLabel="Copy"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <p className="text-xs text-white/40 mb-2">
                        Description
                      </p>

                      <p className="text-sm text-white/60 leading-6">
                        {selected.description || "No description available."}
                      </p>
                    </div>

                    {/* Category */}
                    <div>
                      <p className="text-xs text-white/40 mb-2">
                        Category
                      </p>

                      <span className="text-xs text-[#3be8ff]">
                        {selected.category || "General"}
                      </span>
                    </div>

                    {/* Props */}
                    {Array.isArray(selected.props) &&
                      selected.props.length > 0 && (
                        <div>
                          <p className="text-xs text-white/40 mb-2">
                            Available Props
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {selected.props.map((prop, index) => (
                              <span
                                key={index}
                                className="px-3 py-1.5 rounded-lg bg-[#3be8ff]/[0.07] border border-[#3be8ff]/20 text-xs text-[#3be8ff]"
                              >
                                {prop}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Quick Tip */}
                    <div className="p-4 rounded-xl border border-[#3be8ff]/15 bg-[#3be8ff]/[0.04] flex items-start gap-3">
                      <TbBook
                        size={18}
                        className="text-[#3be8ff] shrink-0 mt-0.5"
                      />

                      <p className="text-xs text-white/45 leading-6">
                        Make sure the component is exported from the
                        PixelAI library before importing it into your
                        project.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Initial Main Page */
            <GuidePanel />
          )}
        </main>
      </div>
    </div>
  );
}

export default AllComponents;

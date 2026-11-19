function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">

        <h2 className="mb-2 text-2xl font-bold text-gray-800">
          Primary Button
        </h2>

        <p className="mb-6 text-sm text-gray-500">
          A reusable button component for PixelAI.
        </p>

        <button
          className="w-full rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700"
          onClick={() => alert("Button clicked successfully!")}
        >
          Get Started
        </button>

        <button
          className="mt-3 w-full rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700"
          onClick={() => alert("Secondary button clicked!")}
        >
          Learn More
        </button>

      </div>
    </div>
  );
}

export default App;
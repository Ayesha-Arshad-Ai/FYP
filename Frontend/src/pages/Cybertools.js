import React, { useState } from "react";
import Header from "../components/Header";

const Cybertools = () => {
  const [mode, setMode] = useState("image");
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [inputText, setInputText] = useState("");
  const [cleanedText, setCleanedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // image selection
  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
    setProcessedImage(null);
    setError("");
  };

  // submit to FastAPI, get a base64 string, and show it
  const handleImageSubmit = async () => {
    if (!selectedImage) {
      setError("Please select an image to clean.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const res = await fetch("http://localhost:8000/cyber_free_image", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Image processing failed.");
      }

      // read the raw Base64 string instead of JSON
      const b64 = await res.text();
      if (!b64) {
        throw new Error("No image returned from server.");
      }

      // create a data URL
      setProcessedImage(`data:image/png;base64,${b64}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // text‐cleaning (unchanged)
  const handleTextSubmit = async () => {
    if (!inputText.trim()) {
      setError("Please enter text to clean.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("text", inputText);

      const res = await fetch("http://localhost:8000/cyber_free_text", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Text processing failed.");
      }

      const json = await res.json();
      setCleanedText(json.cleaned_text);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12">
        {/* Heading */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0f172a]">CyberShield Tools</h1>
          <p className="text-gray-600 mt-2">AI-powered cleaning for images & text</p>
        </section>

        {/* Mode Switch */}
        <div className="flex justify-center mb-10 gap-4">
          {["image", "text"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setMode(tab);
                setError("");
              }}
              className={`px-6 py-2 rounded-full font-semibold transition-colors duration-200 ${
                mode === tab
                  ? "bg-[#00f7ff] text-white shadow-lg"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {tab === "image" ? "Image Cleaner" : "Text Cleaner"}
            </button>
          ))}
        </div>

        <div className="max-w-5xl mx-auto">
          {mode === "image" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Upload Panel */}
              <div className="bg-gray-50 p-8 rounded-2xl shadow-lg flex flex-col items-center space-y-6">
                <p className="text-gray-600 font-medium">Select an image to clean</p>
                <label className="w-full cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-[#00f7ff] h-64">
                    {selectedImage ? (
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Preview"
                        className="max-h-full object-contain"
                      />
                    ) : (
                      <p className="text-gray-400">Click to upload</p>
                    )}
                  </div>
                </label>
                <button
                  onClick={handleImageSubmit}
                  disabled={loading}
                  className="btn-grad w-full py-2 rounded-md flex justify-center items-center"
                >
                  {loading && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  )}
                  {loading ? "Processing..." : "Clean Image"}
                </button>
              </div>

              {/* Processed Output */}
              <div className="bg-gray-50 p-8 rounded-2xl shadow-lg flex flex-col items-center space-y-6">
                <p className="text-gray-600 font-medium">Processed Output</p>
                <div className="border rounded-lg overflow-hidden w-full h-64 flex items-center justify-center bg-white">
                  {processedImage ? (
                    <img
                      src={processedImage}
                      alt="Cleaned"
                      className="max-h-full object-contain"
                    />
                  ) : (
                    <p className="text-gray-400">No output yet</p>
                  )}
                </div>
                {processedImage && (
                  <a href={processedImage} download="cleaned_image.png" className="w-full">
                    <button className="btn-grad w-full py-2 rounded-md">
                      Download Image
                    </button>
                  </a>
                )}
              </div>
            </div>
          ) : (
            // Text Cleaner Panel
            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
              <p className="text-gray-600 font-medium mb-6">Enter text to clean</p>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows="6"
                className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-[#00f7ff] mb-4"
                placeholder="Type or paste your text here..."
              />
              <button
                onClick={handleTextSubmit}
                disabled={loading}
                className="btn-grad py-2 rounded-md flex justify-center items-center"
              >
                {loading && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                )}
                {loading ? "Cleaning..." : "Clean Text"}
              </button>
              {cleanedText ? (
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow mt-6">
                  <h3 className="text-xl font-medium mb-2 text-[#0f172a]">Cleaned Text</h3>
                  <p className="text-gray-800 whitespace-pre-line">{cleanedText}</p>
                </div>
              ) : (
                <div className="text-gray-400 mt-6">No cleaned text yet.</div>
              )}
            </div>
          )}
          {error && <p className="text-red-500 text-center mt-6">{error}</p>}
        </div>
      </main>
    </div>
  );
};

export default Cybertools;

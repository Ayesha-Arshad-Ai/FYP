import React, { useState } from "react";
import { useToken } from "../context/TokenContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const moods = ["Happy", "Sad", "Excited", "Inspired", "Angry", "Peaceful"];

const PostForm = () => {
  const { token } = useToken();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    caption: "",
    image: null,
    mood: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [serverMessage, setServerMessage] = useState(""); // <-- new state for server validation errors

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setServerMessage("");

    if (!token) {
      setError("You must be logged in.");
      return;
    }

    if (!formData.caption.trim() && !formData.image) {
      setError("Please provide at least a caption or an image.");
      return;
    }

    const data = new FormData();
    data.append("token", token);
    if (formData.caption) data.append("caption", formData.caption);
    if (formData.mood) data.append("mood", formData.mood);
    if (formData.image) data.append("image", formData.image);

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/posts", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      setLoading(false);

      if (result.status) {
        alert("✅ " + result.message);
        navigate("/");
      } else {
        setServerMessage(`⚠️  ${result.message}\nSuggestion: ${result.suggestion}\nType: ${result.cyberbullying_type}`);
      }
    } catch (err) {
      console.error("Post creation failed:", err);
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12">
        {/* Page Heading */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0f172a]">
            Create a New Post
          </h1>
          <p className="text-gray-600 mt-2">Share your mood and thoughts with others</p>
        </section>

        {/* Form Card */}
        <div className="max-w-3xl mx-auto bg-gray-50 p-8 rounded-2xl shadow-lg transition hover:shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Caption */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Caption</label>
              <textarea
                name="caption"
                value={formData.caption}
                onChange={handleChange}
                rows="4"
                placeholder="Write something..."
                className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-[#00f7ff] resize-none"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Upload Image</label>
              <label className="w-full cursor-pointer">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-[#00f7ff] transition h-48">
                  {formData.image ? (
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="Selected"
                      className="max-h-full object-contain"
                    />
                  ) : (
                    <p className="text-gray-400">Click to upload</p>
                  )}
                </div>
              </label>
            </div>

            {/* Mood Selector */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Mood</label>
              <select
                name="mood"
                value={formData.mood}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-[#00f7ff]"
              >
                <option value="">Select Mood</option>
                {moods.map((mood) => (
                  <option key={mood} value={mood}>
                    {mood}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-grad w-full py-3 rounded-lg flex justify-center items-center text-white font-semibold text-lg transition"
            >
              {loading && (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              )}
              {loading ? "Posting..." : "Create Post"}
            </button>

            {/* Error Message */}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {/* Server Error Message (like Chatbot) */}
            {serverMessage && (
              <div className="bg-red-500 text-white px-6 py-4 rounded-lg">
                <pre className="whitespace-pre-wrap">{serverMessage}</pre>
              </div>
            )}

          </form>
        </div>
      </main>
    </div>
  );
};

export default PostForm;

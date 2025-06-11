import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/signup", {
        name: username,
        email: email,
        password: password,
        confirm_password: confirmPassword,
      });

      if (response.data.message === "User registered successfully") {
        navigate("/login");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMessage("An error occurred during signup. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Sticky CyberShield Header */}
      <Header />

      {/* Signup Card */}
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center text-[#0f172a]">
            Sign Up
          </h2>
          {errorMessage && (
            <div className="mb-4 text-red-600 text-center">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#00f7ff]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#00f7ff]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#00f7ff]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#00f7ff]"
                required
              />
            </div>
            <button
              type="submit"
              className="btn-grad w-full text-center py-3"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
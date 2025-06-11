import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useToken } from "../context/TokenContext";
import Header from "../components/Header";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setToken } = useToken();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMessage("Both username and password are required.");
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Login failed.");
      setToken(data.token);
      window.location.href = "/";
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleGoogleLoginSuccess = async ({ credential }) => {
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Google login failed.");
      setToken(data.token);
      window.location.href = "/";
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleGoogleLoginFailure = (error) => {
    console.error("Google Login Error:", error);
    setErrorMessage("Google login failed. Please try again.");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Sticky CyberShield Header */}
      <Header />

      {/* Centered Login Card */}
      <div className="flex-grow flex justify-center items-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-6 text-[#0f172a]">
            Login
          </h2>

          {errorMessage && (
            <div className="bg-red-500 text-white p-2 rounded mb-4">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="username"
                type="text"
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00f7ff]"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00f7ff]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-grad w-full">
              Login
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-500 mb-2">Or</p>
            <GoogleOAuthProvider clientId="34128153484-2lfk3rb9pn431vscnsmb252t0n4oibqh.apps.googleusercontent.com">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onFailure={handleGoogleLoginFailure}
                cookiePolicy="single_host_origin"
              />
            </GoogleOAuthProvider>
          </div>

          <div className="text-center mt-6">
            <Link to="/signup" className="text-[#00f7ff] hover:underline">
              Don’t have an account? Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

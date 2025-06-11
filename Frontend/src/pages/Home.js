import React from "react";
import Header from "../components/Header";
import { useToken } from "../context/TokenContext";
import PostPage from "./Posts";
import { Link } from "react-router-dom";

const Home = () => {
  const { token } = useToken();

  if (token) {
    return <PostPage />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Sticky CyberShield Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow pt-24 max-w-4xl mx-auto px-4 pb-12 text-center">
        <div className="mb-6 text-6xl">🛡️</div>

        <h1 className="text-4xl font-bold mb-4 text-[#0f172a]">
          Welcome to CyberShield
        </h1>

        <p className="text-gray-600 text-lg mb-8">
          Your personal protection against cyberbullying and online harassment.
          Post content with confidence knowing our AI helps keep you safe.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Link
            to="/login"
            className="btn-grad px-6 py-3 text-center text-lg w-full sm:w-auto"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="btn-grad px-6 py-3 text-center text-lg w-full sm:w-auto"
          >
            Create Account
          </Link>
        </div>

        {/* Features */}
        <h2 className="text-2xl font-semibold mb-6 text-[#0f172a]">
          Features
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "AI Content Protection",
              text: "Our advanced AI analyzes images and text to filter out cyberbullying content before it reaches you.",
            },
            {
              title: "Security Assistant",
              text: "Get personalized cybersecurity advice from our AI chatbot to protect your digital presence.",
            },
            {
              title: "Safe Community",
              text: "Join a community where everyone's content is protected from harmful behavior and cyberbullying.",
            },
          ].map(({ title, text }) => (
            <div
              key={title}
              className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2 text-[#0f172a]">{title}</h3>
              <p className="text-gray-700 text-sm">
                {text}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;

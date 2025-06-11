import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PostForm from "./pages/UploadPost";
import Chatbot from "./pages/Chatbot";
import Login from "./pages/Login";  // Import Login component
import Signup from "./pages/Signup";  // Import Signup component
import PostPage from "./pages/Posts";
import Profile from "./pages/Profile";
import { TokenProvider } from "./context/TokenContext"; // Adjust path as needed
import CyberTools from "./pages/Cybertools"
const App = () => {
  return (
      <TokenProvider>
    <Router>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* Generate Design Page */}
        <Route path="/text-post" element={<PostForm />} />

        {/* Chatbot Page */}
        <Route path="/chatbot" element={<Chatbot />} />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />
         {/* Login Page */}
        <Route path="/posts" element={<PostPage />} />


        {/* Signup Page */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/edit_profile" element={<Profile />} />

        <Route path="/tools" element={<CyberTools />} />




      </Routes>
    </Router>
      </TokenProvider>
  );
};

export default App;

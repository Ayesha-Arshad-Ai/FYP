import React, { useState, useEffect, useRef } from "react";
import { FaUser, FaBars } from "react-icons/fa";
import { useToken } from "../context/TokenContext";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const dropdownRef = useRef(null);
  const { token, setToken } = useToken();
  const navigate = useNavigate();

  // Fetch user data
  useEffect(() => {
    if (!token) {
      setUserDetails(null);
      setLoadingUser(false);
      return;
    }

    const fetchUserDetails = async () => {
      try {
        setLoadingUser(true);
        const res = await fetch(`http://localhost:8000/get_user_details/${token}`);
        const data = await res.json();
        if (data.status) {
          setUserDetails(data.data);
        } else {
          setUserDetails(null);
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
        setUserDetails(null);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserDetails();
  }, [token]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setToken("");
    sessionStorage.removeItem("token");
    navigate("/");
  };

  const navLinks = [
    { name: "Upload", path: "/text-post" },
    { name: "Chatbot", path: "/chatbot" },
    { name: "Cyber Tools", path: "/tools" },
  ];

  return (
    <header className="bg-[#0f172a] shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-[#00f7ff] tracking-wide">
          CYBERSHIELD
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-white hover:text-[#00f7ff] transition-colors duration-200"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Profile & Auth */}
        <div className="flex items-center space-x-4">
          {token ? (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="focus:outline-none"
              >
                {loadingUser ? (
                  <div className="w-9 h-9 rounded-full bg-gray-300 animate-pulse" />
                ) : userDetails ? (
                  <img
                    src={`../assests/profile_images/${userDetails.profile_pic}`}
                    alt={userDetails.name}
                    className="w-9 h-9 rounded-full border-2 border-[#00f7ff]"
                  />
                ) : (
                  <FaUser className="w-8 h-8 text-white" />
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-md shadow-md py-2 z-50">
                  <Link
                    to="/edit_profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex gap-4">
              <Link
                to="/login"
                className="bg-[#00f7ff] text-black px-4 py-2 rounded-md font-semibold hover:bg-white transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-white text-black px-4 py-2 rounded-md font-semibold hover:bg-[#00f7ff] hover:text-black transition"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FaBars className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#1e293b] text-white px-4 pb-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="hover:text-[#00f7ff] transition"
              >
                {link.name}
              </Link>
            ))}
            {!token ? (
              <div className="mt-4 flex flex-col space-y-2">
                <Link
                  to="/login"
                  className="bg-[#00f7ff] text-black py-2 text-center rounded-md font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-white text-black py-2 text-center rounded-md font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <>
                <Link
                  to="/edit_profile"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-[#00f7ff]"
                >
                  View Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="text-left mt-2 hover:text-[#00f7ff]"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const TokenContext = createContext();

// Create a provider to manage and distribute the token globally
export const TokenProvider = ({ children }) => {
  // Get token from sessionStorage instead of localStorage
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");

  useEffect(() => {
    // If the token changes, update it in sessionStorage
    if (token) {
      sessionStorage.setItem("token", token);
    } else {
      sessionStorage.removeItem("token"); // If token is cleared, remove from sessionStorage
    }
  }, [token]);

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  );
};

// Custom hook to use the token in other components
export const useToken = () => {
  return useContext(TokenContext);
};

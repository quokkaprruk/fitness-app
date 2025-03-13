/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import * as jwtDecode from "jwt-decode";
import { AuthContext } from "./authContextValue";

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    isAuthenticated: false,
    user: null,
  });

  useEffect(() => {
    // Retrieve token from storage on mount.
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const user = jwtDecode.jwtDecode(token);
        setAuthState({
          token,
          isAuthenticated: true,
          user,
        });
      } catch (error) {
        console.error(`Invalid token: ${error}`);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const user = jwtDecode.jwtDecode(token);
    setAuthState({
      token,
      isAuthenticated: true,
      user,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthState({
      token: null,
      isAuthenticated: false,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

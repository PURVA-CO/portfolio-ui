import { createContext, useContext, useState } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [adminUser, setAdminUser] = useState(
    localStorage.getItem("adminUser") || null
  );

  const login = async (username, password) => {
    const response = await API.post("/auth/login", { username, password });
    const { token, username: user } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("adminUser", user);
    setToken(token);
    setAdminUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminUser");
    setToken(null);
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, adminUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy use
export const useAuth = () => useContext(AuthContext);
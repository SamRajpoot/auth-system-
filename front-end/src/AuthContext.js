
import React, { createContext, useState } from "react";
import { api } from "./api";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  // Attach Authorization header for every request using the latest accessToken
  React.useEffect(() => {
    const interceptor = api.interceptors.request.use(
      (config) => {
        const token = accessToken || localStorage.getItem("accessToken");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    return () => api.interceptors.request.eject(interceptor);
  }, [accessToken]);

  // Login function: calls backend, sets accessToken and user
  const login = async (email, password, remember) => {
    const res = await api.post("/auth/login", { email, password });
    setAccessToken(res.data.data.accessToken);
    setUser(res.data.data.user);
    // Optionally, persist token/user in localStorage if remember is true
    if (remember) {
      localStorage.setItem("accessToken", res.data.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
  };

  // On mount, restore from localStorage if present
  React.useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      setAccessToken(token);
      setUser(JSON.parse(userStr));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, user, setUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};

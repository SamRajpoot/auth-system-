import React, { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { api } from "./api";

// Handles /oauth-callback?provider=google|github&token=...&user=...
export default function OAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAccessToken, setUser } = useContext(AuthContext);

  useEffect(() => {
    // Parse query params
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const userStr = params.get("user");
    if (token && userStr) {
      setAccessToken(token);
      setUser(JSON.parse(decodeURIComponent(userStr)));
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", userStr);
      navigate("/");
    } else {
      // fallback: try to fetch user from backend
      api.get("/auth/me").then(res => {
        setUser(res.data.user);
        navigate("/");
      }).catch(() => navigate("/login"));
    }
  }, [location, setAccessToken, setUser, navigate]);

  return <div>Logging you in...</div>;
}

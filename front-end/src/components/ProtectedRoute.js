import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export default function ProtectedRoute({ children, adminOnly }) {
  const { accessToken, user } = useContext(AuthContext);
  if (!accessToken) return <Navigate to="/login" />;
  if (adminOnly && user?.role !== "admin") return <div>Access denied</div>;
  return children;
}

import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export default function Navbar() {
  const { user, setAccessToken, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    setAccessToken(null);
    setUser(null);
  };

  return (
    <nav>
      <Link to="/login">Login</Link> | <Link to="/register">Register</Link> | <Link to="/otp-login">OTP Login</Link> | <Link to="/profile">Profile</Link> | <Link to="/change-password">Change Password</Link> | <Link to="/admin">Admin</Link>
      {user && <button onClick={handleLogout}>Logout</button>}
    </nav>
  );
}

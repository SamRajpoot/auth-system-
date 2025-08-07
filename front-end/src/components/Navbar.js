import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";

export default function Navbar() {
  const { user, setAccessToken, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setAccessToken(null);
    setUser(null);
    navigate("/login");
  };

  // Cloud theme colors
  const cloudAppBar = {
    background: 'linear-gradient(90deg, #e0f7fa 0%, #b2ebf2 60%, #fff 100%)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    borderBottom: '2px solid #e0f2f1',
    position: 'relative',
    zIndex: 100,
  };

  return (
    <AppBar position="static" sx={cloudAppBar}>
      <Toolbar sx={{ minHeight: 64, px: 2 }}>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="Logo" style={{ width: 40, height: 40, marginRight: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
          <Typography variant="h6" component={Link} to="/" sx={{ color: '#1976d2', textDecoration: 'none', fontWeight: 700, fontSize: 24, letterSpacing: 1 }}>
            Auth System
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button component={Link} to="/admin" sx={{ fontWeight: 600, color: '#1976d2', background: 'rgba(224,247,250,0.7)', borderRadius: 2, px: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', mr: 1 }}>
            Admin
          </Button>
          <Button component={Link} to="/activity-logs" sx={{ fontWeight: 600, color: '#1976d2', background: 'rgba(224,247,250,0.7)', borderRadius: 2, px: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', mr: 1 }}>
            Activity Logs
          </Button>
          <Button component={Link} to="/users" sx={{ fontWeight: 600, color: '#1976d2', background: 'rgba(224,247,250,0.7)', borderRadius: 2, px: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', mr: 1 }}>
            Users
          </Button>
          {user ? (
            <>
              <Button component={Link} to="/profile" sx={{ fontWeight: 600, color: '#1976d2', background: 'rgba(224,247,250,0.7)', borderRadius: 2, px: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', mr: 1 }}>
                Profile
              </Button>
              <Button component={Link} to="/change-password" sx={{ fontWeight: 600, color: '#1976d2', background: 'rgba(224,247,250,0.7)', borderRadius: 2, px: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', mr: 1 }}>
                Change Password
              </Button>
              <IconButton color="primary" component={Link} to="/profile" sx={{ mr: 1 }}>
                <AccountCircle />
              </IconButton>
              <Button onClick={handleLogout} sx={{ fontWeight: 600, color: '#1976d2', background: 'rgba(224,247,250,0.7)', borderRadius: 2, px: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button component={Link} to="/login" sx={{ fontWeight: 600, color: '#1976d2', background: 'rgba(224,247,250,0.7)', borderRadius: 2, px: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', mr: 1 }}>
                Login
              </Button>
              <Button component={Link} to="/register" sx={{ fontWeight: 600, color: '#1976d2', background: 'rgba(224,247,250,0.7)', borderRadius: 2, px: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', mr: 1 }}>
                Register
              </Button>
              <Button component={Link} to="/otp-login" sx={{ fontWeight: 600, color: '#1976d2', background: 'rgba(224,247,250,0.7)', borderRadius: 2, px: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', mr: 1 }}>
                OTP Login
              </Button>
              <Button component={Link} to="/forgot-password" sx={{ fontWeight: 600, color: '#1976d2', background: 'rgba(224,247,250,0.7)', borderRadius: 2, px: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', mr: 1 }}>
                Forgot Password
              </Button>
              <Button component={Link} to="/reset-password" sx={{ fontWeight: 600, color: '#1976d2', background: 'rgba(224,247,250,0.7)', borderRadius: 2, px: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', mr: 1 }}>
                Reset Password
              </Button>
              <Button component={Link} to="/verify-email" sx={{ fontWeight: 600, color: '#1976d2', background: 'rgba(224,247,250,0.7)', borderRadius: 2, px: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                Verify Email
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
      {/* Cloud background accent */}
      <Box sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -8,
        height: 32,
        background: 'url(/clouds-bg.png) repeat-x',
        backgroundSize: 'contain',
        opacity: 0.18,
        zIndex: 1,
      }} />
    </AppBar>
  );
}

import React, { useState, useContext } from "react";
import { api } from "./api";
import { AuthContext } from "./AuthContext";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider
} from "@mui/material";

const cloudBg = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(180deg, #e0f7fa 0%, #fff 100%)',
  backgroundImage: 'url(/clouds-bg.png)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
};

const cardStyle = {
  width: 370,
  padding: '32px 24px',
  borderRadius: 24,
  boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
  background: 'rgba(255,255,255,0.98)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backdropFilter: 'blur(2px)',
};

export default function ChangePassword() {
  const { accessToken } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.put("/users/change-password", { currentPassword, newPassword }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setMessage("Password changed successfully");
    } catch (err) {
      setMessage(err.response?.data?.message || "Change failed");
    }
  };

  return (
    <Box sx={cloudBg}>
      <Card sx={cardStyle}>
        <CardContent sx={{ width: "100%" }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
            <Box sx={{ mb: 2 }}>
              <img src="/logo.png" alt="Logo" style={{ width: 48, height: 48, borderRadius: 12 }} />
            </Box>
            <Typography variant="h5" fontWeight={700} align="center" gutterBottom>
              Change Password
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary">
              Enter your current and new password
            </Typography>
          </Box>
          <form onSubmit={handleChange}>
            <TextField
              label="Current Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
            />
            <TextField
              label="New Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
            {message && (
              <Typography color={message.includes("successfully") ? "primary" : "error"} sx={{ mt: 1, mb: 1 }}>
                {message}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, mb: 2, fontWeight: 600, fontSize: 18, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
            >
              Change Password
            </Button>
            <Divider sx={{ my: 2 }} />
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

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

export default function OTPLogin() {
  const { setAccessToken, setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

  const requestOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/auth/request-otp", { email });
      setStep(2);
      setMessage("OTP sent to your email");
    } catch (err) {
      setMessage("Failed to send OTP");
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await api.post("/auth/verify-otp", { email, otp });
      setAccessToken(res.data.data.accessToken);
      setUser(res.data.data.user);
      setMessage("Login successful!");
    } catch (err) {
      setMessage("Invalid or expired OTP");
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
              OTP Login
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary">
              Login with One-Time Password
            </Typography>
          </Box>
          {step === 1 ? (
            <form onSubmit={requestOtp}>
              <TextField
                label="Email address"
                type="email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              {message && (
                <Typography color={message.includes("OTP sent") ? "primary" : "error"} sx={{ mt: 1, mb: 1 }}>
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
                Request OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={verifyOtp}>
              <TextField
                label="Enter OTP"
                type="text"
                variant="outlined"
                fullWidth
                margin="normal"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
              />
              {message && (
                <Typography color={message.includes("Login successful") ? "primary" : "error"} sx={{ mt: 1, mb: 1 }}>
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
                Verify OTP
              </Button>
            </form>
          )}
          <Divider sx={{ my: 2 }} />
        </CardContent>
      </Card>
    </Box>
  );
}

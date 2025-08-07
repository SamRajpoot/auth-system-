
import React, { useContext, useState } from "react";
import { api } from "./api";
import { AuthContext } from "./AuthContext";
import { Box, Card, CardContent, Typography, TextField, Button, Checkbox, FormControlLabel, Divider, Alert } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

export default function Login() {
  const { setAccessToken, setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await api.post("/auth/login", { email, password });
      setAccessToken(res.data.data.accessToken);
      setUser(res.data.data.user);
      setSuccess("Login successful!");
    } catch (err) {
      setError("Login failed");
    }
  };

  // Google login handler (redirect to backend OAuth)
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(120deg, #f6d365 0%, #fda085 100%)",
      position: "relative"
    }}>
      <Card sx={{ minWidth: 350, maxWidth: 400, mx: 2, boxShadow: 8, borderRadius: 3, backdropFilter: "blur(2px)" }}>
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Box sx={{ mb: 2 }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/Bitmap_Icon_Wave.png" alt="logo" width={48} height={48} style={{ borderRadius: 12 }} />
            </Box>
            <Typography variant="h6" fontWeight={700} align="center">Create your account</Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>Get Started for free</Typography>
            {error && <Alert severity="error" sx={{ width: "100%", mb: 1 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ width: "100%", mb: 1 }}>{success}</Alert>}
            <Box component="form" onSubmit={handleLogin} sx={{ width: "100%" }}>
              <TextField
                label="Email address"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <FormControlLabel
                  control={<Checkbox checked={remember} onChange={e => setRemember(e.target.checked)} />}
                  label="Remember me"
                />
                <Button variant="text" size="small" href="/forgot-password">Forgot Password</Button>
              </Box>
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 1, mb: 2, fontWeight: 700, fontSize: 18, py: 1.5, boxShadow: 2 }}>Login</Button>
            </Box>
            <Divider sx={{ my: 2 }}>or</Divider>
            <Button
              variant="contained"
              fullWidth
              startIcon={<GoogleIcon />}
              sx={{ background: "linear-gradient(90deg, #232526 0%, #414345 100%)", color: "#fff", fontWeight: 700, fontSize: 16, py: 1.2, boxShadow: 2 }}
              onClick={handleGoogleLogin}
            >
              Continue with Google
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}


import React, { useContext, useState } from "react";
import { api } from "./api";
import { AuthContext } from "./AuthContext";
import { Box, Card, CardContent, Typography, TextField, Button, Checkbox, FormControlLabel, Divider, Alert } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password, remember);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  // Google login handler (redirect to backend OAuth)
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  const handleGithubLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/github";
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg, #e0f7fa 0%, #fff 100%)',
      backgroundImage: 'url(/clouds-bg.png)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    }}>
      <Card sx={{ minWidth: 350, maxWidth: 400, mx: 2, boxShadow: 4, borderRadius: 24, backdropFilter: "blur(2px)", background: 'rgba(255,255,255,0.98)' }}>
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Box sx={{ mb: 2 }}>
              <img src="/logo.png" alt="Logo" width={48} height={48} style={{ borderRadius: 12 }} />
            </Box>
            <Typography variant="h6" fontWeight={700} align="center">Create your account</Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>Get Started for free</Typography>
            {error && (
              <Typography color="error" sx={{ mt: 1, mb: 1 }}>
                {error}
              </Typography>
            )}
            <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<GoogleIcon />}
                sx={{
                  background: 'linear-gradient(90deg, #fff 0%, #e0e0e0 100%)',
                  color: '#222',
                  fontWeight: 700,
                  fontSize: 16,
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  mb: 1,
                  border: '1px solid #eee',
                  '&:hover': { background: 'linear-gradient(90deg, #f5f5f5 0%, #e0e0e0 100%)' }
                }}
                onClick={handleGoogleLogin}
              >
                Continue with Google
              </Button>
              <Button
                variant="contained"
                fullWidth
                startIcon={<GitHubIcon />}
                sx={{
                  background: 'linear-gradient(90deg, #fff 0%, #e0e0e0 100%)',
                  color: '#222',
                  fontWeight: 700,
                  fontSize: 16,
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  mb: 1,
                  border: '1px solid #eee',
                  '&:hover': { background: 'linear-gradient(90deg, #f5f5f5 0%, #e0e0e0 100%)' }
                }}
                onClick={handleGithubLogin}
              >
                Continue with GitHub
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

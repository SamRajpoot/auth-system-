import React, { useContext, useEffect, useState } from "react";
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

export default function Profile() {
  const { accessToken, user, setUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!accessToken) return;
    api.get("/users/profile", {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(res => {
        setName(res.data.data.name);
        setEmail(res.data.data.email);
      })
      .catch(() => setMessage("Error fetching profile"));
  }, [accessToken]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await api.put("/users/profile", { name, email }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setUser(res.data.data);
      setMessage("Profile updated");
    } catch (err) {
      setMessage("Update failed");
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
              Profile
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary">
              Update your profile information
            </Typography>
          </Box>
          <form onSubmit={handleUpdate}>
            <TextField
              label="Name"
              type="text"
              variant="outlined"
              fullWidth
              margin="normal"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
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
              <Typography color={message.includes("updated") ? "primary" : "error"} sx={{ mt: 1, mb: 1 }}>
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
              Update Profile
            </Button>
            <Divider sx={{ my: 2 }} />
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

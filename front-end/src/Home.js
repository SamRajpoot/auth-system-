import React from "react";
import { Box, Card, CardContent, Typography, Divider } from "@mui/material";

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
  width: 420,
  padding: '40px 32px',
  borderRadius: 28,
  boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
  background: 'rgba(255,255,255,0.98)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backdropFilter: 'blur(2px)',
};

export default function Home() {
  return (
    <Box sx={cloudBg}>
      <Card sx={cardStyle}>
        <CardContent sx={{ width: "100%" }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
            <Box sx={{ mb: 2 }}>
              <img src="/logo.png" alt="Logo" style={{ width: 64, height: 64, borderRadius: 16 }} />
            </Box>
            <Typography variant="h4" fontWeight={700} align="center" gutterBottom>
              Welcome to Auth System
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 2 }}>
              Secure authentication, user management, and activity logs with a beautiful cloud theme.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1" align="center" color="text.secondary">
              Use the navigation bar to access Login, Register, Profile, Admin Dashboard, Activity Logs, and more.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

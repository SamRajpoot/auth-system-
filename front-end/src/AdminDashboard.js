import React from "react";
import UserList from "./UserList";
import ActivityLogs from "./ActivityLogs";
import { Box, Card, CardContent, Typography, Divider } from "@mui/material";

const gradientBg = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(120deg, #f6d365 0%, #fd6e6a 100%)",
};

const cardStyle = {
  width: 900,
  padding: "32px 24px",
  borderRadius: 16,
  boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
  background: "rgba(255,255,255,0.95)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

export default function AdminDashboard() {
  return (
    <Box sx={gradientBg}>
      <Card sx={cardStyle}>
        <CardContent sx={{ width: "100%" }}>
          <Typography variant="h4" fontWeight={700} align="center" gutterBottom>
            Admin Dashboard
          </Typography>
          <Divider sx={{ my: 2 }} />
          <UserList />
          <Divider sx={{ my: 2 }} />
          <ActivityLogs />
        </CardContent>
      </Card>
    </Box>
  );
}

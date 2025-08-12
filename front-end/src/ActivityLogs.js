import React, { useEffect, useState, useContext } from "react";
import { api } from "./api";
import { AuthContext } from "./AuthContext";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ActivityLogs() {
  const { user, accessToken } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    if (!user || user.role !== "admin" || !accessToken) {
      setError("You are not authorized to view this page.");
      setLoading(false);
      return;
    }
    api.get("/activity-logs")
      .then(res => {
        setLogs(res.data.data.logs);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.message || "Failed to fetch activity logs");
        setLoading(false);
      });
  }, [user, accessToken]);

  if (!user || user.role !== "admin") return <Alert severity="error">You are not authorized to view this page.</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} mb={2}>Activity Logs</Typography>
      {loading ? <CircularProgress /> : error ? <Alert severity="error">{error}</Alert> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map(log => (
                <TableRow key={log._id}>
                  <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{log.user?.email || "-"}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{typeof log.details === 'object' && log.details !== null ? JSON.stringify(log.details) : log.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

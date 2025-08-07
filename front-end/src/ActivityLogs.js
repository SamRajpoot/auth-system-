import React, { useContext, useEffect, useState } from "react";
import { api } from "./api";
import { AuthContext } from "./AuthContext";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper
} from "@mui/material";

export default function ActivityLogs() {
  const { accessToken } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!accessToken) return;
    api.get("/activity-logs", {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(res => setLogs(res.data.data.logs))
      .catch(err => alert("Error fetching logs"));
  }, [accessToken]);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Activity Logs</Typography>
      <Paper sx={{ maxHeight: 300, overflow: 'auto' }}>
        <List>
          {logs.map(log => (
            <ListItem key={log._id} divider>
              <ListItemText
                primary={`${log.action} by ${log.user?.name || 'Unknown'} (${log.user?.email || 'N/A'})`}
                secondary={new Date(log.createdAt).toLocaleString()}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

import React, { useContext, useEffect, useState } from "react";
import { api } from "./api";
import { AuthContext } from "./AuthContext";

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
    <div>
      <h2>Activity Logs</h2>
      <ul>
        {logs.map(log => (
          <li key={log._id}>
            {log.action} by {log.user?.name} ({log.user?.email}) at {new Date(log.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

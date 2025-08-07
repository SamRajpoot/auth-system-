import React from "react";
import UserList from "./UserList";
import ActivityLogs from "./ActivityLogs";

export default function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <UserList />
      <ActivityLogs />
    </div>
  );
}

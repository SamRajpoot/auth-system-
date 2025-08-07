import React, { useState, useContext } from "react";
import { api } from "./api";
import { AuthContext } from "./AuthContext";

export default function ChangePassword() {
  const { accessToken } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = async (e) => {
    e.preventDefault();
    try {
      await api.put("/users/change-password", { currentPassword, newPassword }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setMessage("Password changed successfully");
    } catch (err) {
      setMessage("Change failed");
    }
  };

  return (
    <form onSubmit={handleChange}>
      <input value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} type="password" placeholder="Current Password" />
      <input value={newPassword} onChange={e => setNewPassword(e.target.value)} type="password" placeholder="New Password" />
      <button type="submit">Change Password</button>
      <div>{message}</div>
    </form>
  );
}

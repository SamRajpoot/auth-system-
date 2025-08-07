import React, { useState } from "react";
import { api } from "./api";

export default function ResetPassword() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/reset-password", { token, newPassword });
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Failed to reset password");
    }
  };

  return (
    <form onSubmit={handleReset}>
      <input value={token} onChange={e => setToken(e.target.value)} placeholder="Reset Token" />
      <input value={newPassword} onChange={e => setNewPassword(e.target.value)} type="password" placeholder="New Password" />
      <button type="submit">Reset Password</button>
      <div>{message}</div>
    </form>
  );
}

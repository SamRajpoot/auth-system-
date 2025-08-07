import React, { useState } from "react";
import { api } from "./api";

export default function VerifyEmail() {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await api.get(`/auth/verify-email?token=${token}`);
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Verification failed");
    }
  };

  return (
    <form onSubmit={handleVerify}>
      <input value={token} onChange={e => setToken(e.target.value)} placeholder="Verification Token" />
      <button type="submit">Verify Email</button>
      <div>{message}</div>
    </form>
  );
}

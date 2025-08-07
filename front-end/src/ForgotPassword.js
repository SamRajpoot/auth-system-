import React, { useState } from "react";
import { api } from "./api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Failed to send reset link");
    }
  };

  return (
    <form onSubmit={handleForgot}>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <button type="submit">Send Reset Link</button>
      <div>{message}</div>
    </form>
  );
}

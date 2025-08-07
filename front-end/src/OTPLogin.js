import React, { useState } from "react";
import { api } from "./api";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export default function OTPLogin() {
  const { setAccessToken, setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

  const requestOtp = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/request-otp", { email });
      setStep(2);
      setMessage("OTP sent to your email");
    } catch (err) {
      setMessage("Failed to send OTP");
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/verify-otp", { email, otp });
      setAccessToken(res.data.data.accessToken);
      setUser(res.data.data.user);
      setMessage("Login successful!");
    } catch (err) {
      setMessage("Invalid or expired OTP");
    }
  };

  return (
    <div>
      {step === 1 ? (
        <form onSubmit={requestOtp}>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          <button type="submit">Request OTP</button>
        </form>
      ) : (
        <form onSubmit={verifyOtp}>
          <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter OTP" />
          <button type="submit">Verify OTP</button>
        </form>
      )}
      <div>{message}</div>
    </div>
  );
}

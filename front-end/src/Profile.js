import React, { useContext, useEffect, useState } from "react";
import { api } from "./api";
import { AuthContext } from "./AuthContext";

export default function Profile() {
  const { accessToken, user, setUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!accessToken) return;
    api.get("/users/profile", {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(res => {
        setName(res.data.data.name);
        setEmail(res.data.data.email);
      })
      .catch(() => setMessage("Error fetching profile"));
  }, [accessToken]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/users/profile", { name, email }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setUser(res.data.data);
      setMessage("Profile updated");
    } catch (err) {
      setMessage("Update failed");
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <button type="submit">Update Profile</button>
      <div>{message}</div>
    </form>
  );
}

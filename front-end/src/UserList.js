import React, { useContext, useEffect, useState } from "react";
import { api } from "./api";
import { AuthContext } from "./AuthContext";

export default function UserList() {
  const { accessToken, user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!accessToken || user?.role !== "admin") return;
    api.get("/users", {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { page, limit, search }
    })
      .then(res => {
        setUsers(res.data.data.users);
        setTotalPages(res.data.data.totalPages);
      })
      .catch(() => alert("Error fetching users"));
  }, [accessToken, user, page, search, limit]);

  if (user?.role !== "admin") return <div>Access denied</div>;

  return (
    <div>
      <h2>User List</h2>
      <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name or email" />
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span> Page {page} of {totalPages} </span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}

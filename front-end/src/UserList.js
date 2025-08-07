import React, { useContext, useEffect, useState } from "react";
import { api } from "./api";
import { AuthContext } from "./AuthContext";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from "@mui/material";

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

  if (user?.role !== "admin") return <Typography color="error">Access denied</Typography>;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>User List</Typography>
      <TextField
        value={search}
        onChange={e => { setSearch(e.target.value); setPage(1); }}
        placeholder="Search by name or email"
        variant="outlined"
        sx={{ mb: 2, width: 300 }}
      />
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(u => (
              <TableRow key={u._id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button variant="outlined" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</Button>
        <Typography>Page {page} of {totalPages}</Typography>
        <Button variant="outlined" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
      </Box>
    </Box>
  );
}

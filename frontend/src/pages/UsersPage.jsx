// src/pages/UsersPage.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    userid: "",
    full_name: "",
    email: "",
    designation: "",
    password: "",
    role: "STUDENT", // default role
  });

  const token = localStorage.getItem("aero_token");

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError("Failed fetching users: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createUser(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://127.0.0.1:8000/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to create user");
      }

      const newUser = await res.json();
      setUsers((prev) => [...prev, newUser]);
      setSuccess("User created successfully ✅");
      setForm({
        userid: "",
        full_name: "",
        email: "",
        designation: "",
        password: "",
        role: "STUDENT",
      });
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Manage Users
      </Typography>

      {/* ✅ Centered Create User Form */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Paper sx={{ p: 3, maxWidth: 500, width: "100%" }}>
          <Typography variant="subtitle1" gutterBottom>
            Create New User
          </Typography>
          <Box
            component="form"
            onSubmit={createUser}
            sx={{ display: "grid", gap: 2 }}
          >
            <TextField
              label="User ID"
              value={form.userid}
              onChange={(e) => setForm({ ...form, userid: e.target.value })}
              required
            />
            <TextField
              label="Full Name"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            />
            <TextField
              label="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <TextField
              label="Designation"
              value={form.designation}
              onChange={(e) =>
                setForm({ ...form, designation: e.target.value })
              }
            />
            <TextField
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <TextField
              label="Role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="SUPERADMIN / GD / DH / STUDENT / TL / SM / OIC"
            />
            <Button type="submit" variant="contained">
              Create User
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* ✅ Users List Below */}
      {loading ? (
        <CircularProgress />
      ) : (
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Existing Users
          </Typography>
          {users.length === 0 ? (
            <Typography>No users found</Typography>
          ) : (
            users.map((u) => (
              <Typography key={u.id}>
                {u.userid} – {u.full_name} ({u.role})
              </Typography>
            ))
          )}
        </Paper>
      )}

      {/* Notifications */}
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError("")}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess("")}
      >
        <Alert severity="success">{success}</Alert>
      </Snackbar>
    </Box>
  );
}

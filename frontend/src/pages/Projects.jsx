// src/pages/Projects.jsx
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

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const token = localStorage.getItem("aero_token");

  async function fetchProjects() {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/projects/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      const data = await res.json();
      setProjects(data);
    } catch (err) {
      setError("Failed fetching projects: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createProject(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://127.0.0.1:8000/projects/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to create project");
      }

      const newProj = await res.json();
      setProjects((prev) => [...prev, newProj]);
      setSuccess("Project created successfully ✅");
      setForm({ name: "", description: "" });
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Manage Projects
      </Typography>

      {/* Project creation form */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Create New Project
        </Typography>
        <Box
          component="form"
          onSubmit={createProject}
          sx={{ display: "grid", gap: 2, maxWidth: 400 }}
        >
          <TextField
            label="Project Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <TextField
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Button type="submit" variant="contained">
            Create Project
          </Button>
        </Box>
      </Paper>

      {/* Projects List */}
      {loading ? (
        <CircularProgress />
      ) : (
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Existing Projects
          </Typography>
          {projects.length === 0 ? (
            <Typography>No projects found</Typography>
          ) : (
            projects.map((p) => (
              <Typography key={p.id}>
                {p.name} – {p.description}
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

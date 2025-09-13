// src/pages/Dashboard.jsx
import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // SUPERADMIN, GD, DH, etc.

  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* ✅ Always visible */}
      <Button
        variant="contained"
        onClick={() => navigate("/dashboard")}
        sx={{ width: 200 }}
      >
        Home
      </Button>

      {/* ✅ Only SUPERADMIN, GD, DH see Users */}
      {["SUPERADMIN", "GD", "DH"].includes(role) && (
        <Button
          variant="contained"
          onClick={() => navigate("/users")}
          sx={{ width: 200 }}
        >
          Users
        </Button>
      )}

      {/* ✅ Only SUPERADMIN, GD, DH see Projects */}
      {["SUPERADMIN", "GD", "DH"].includes(role) && (
        <Button
          variant="contained"
          onClick={() => navigate("/projects")}
          sx={{ width: 200 }}
        >
          Projects
        </Button>
      )}

      {/* ✅ Example: show student-only page */}
      {role === "STUDENT" && (
        <Typography variant="body1" sx={{ mt: 3 }}>
          Welcome Student! You only have limited privileges.
        </Typography>
      )}
    </Box>
  );
}

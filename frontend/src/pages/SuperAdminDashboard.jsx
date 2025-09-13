import React from "react";
import { Typography, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function SuperAdminDashboard() {
  return (
    <Box textAlign="center">
      <Typography variant="h4" gutterBottom>
        Super Admin Dashboard
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center", mt: 4 }}>
        <Button variant="contained" component={RouterLink} to="/dashboard/users">
          Manage Users
        </Button>
        <Button variant="contained" component={RouterLink} to="/dashboard/projects">
          Manage Projects
        </Button>
      </Box>
    </Box>
  );
}

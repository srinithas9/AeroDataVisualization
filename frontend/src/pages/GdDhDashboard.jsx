import React from "react";
import { Typography, Box, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function GdDhDashboard() {
  return (
    <Box textAlign="center">
      <Typography variant="h4">GD / DH Dashboard</Typography>
      <Typography sx={{ mt: 2 }}>You can create and manage projects.</Typography>
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" component={RouterLink} to="/dashboard/projects">
          Projects
        </Button>
      </Box>
    </Box>
  );
}

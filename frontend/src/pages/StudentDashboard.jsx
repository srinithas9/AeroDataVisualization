import React from "react";
import { Typography, Box } from "@mui/material";

export default function StudentDashboard() {
  return (
    <Box textAlign="center">
      <Typography variant="h4">Student Dashboard</Typography>
      <Typography sx={{ mt: 2 }}>Limited data-only access.</Typography>
    </Box>
  );
}

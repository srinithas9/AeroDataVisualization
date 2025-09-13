import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function TopBar({ title = "AeroDataVisualization" }) {
  const { logout, user } = useAuth();
  const nav = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" component="div">{title}</Typography>
        <div>
          {user && (
            <>
              <Typography variant="body2" component="span" sx={{ mr: 2 }}>
                {user.sub} ({user.role || "USER"})
              </Typography>
              <Button color="inherit" onClick={() => { logout(); nav("/login"); }}>
                Logout
              </Button>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}

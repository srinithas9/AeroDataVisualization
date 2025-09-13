import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SuperAdminDashboard from "./SuperAdminDashboard";
import GdDhDashboard from "./GdDhDashboard";
import TlsmOicDashboard from "./TlsmOicDashboard";
import StudentDashboard from "./StudentDashboard";
import UsersPage from "./UsersPage";
import Projects from "./Projects";
import TopBar from "../components/TopBar";
import { useAuth } from "../context/AuthContext";
import { Container } from "@mui/material";

export default function DashboardRouter() {
  const { user, role, roleType } = useAuth();

  // Prefer explicit role stored in context (from backend response).
  // If not present, try to read role from token payload (user object).
  let effectiveRole = role || (user && user.role) || (user && user.sub && user.sub.toUpperCase());
  // If backend uses numeric role types, fallback on that mapping:
  if (!effectiveRole && roleType) {
    // map roleType numbers to human readable if you used that mapping
    if (roleType === 1) effectiveRole = "SUPERADMIN";
    if (roleType === 2) effectiveRole = "TL"; // generic fallback
    if (roleType === 3) effectiveRole = "STUDENT";
  }

  return (
    <>
      <TopBar />
      <Container sx={{ mt: 6 }}>
        <Routes>
          {effectiveRole === "SUPERADMIN" && (
            <>
              <Route path="/" element={<SuperAdminDashboard />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="projects" element={<Projects />} />
            </>
          )}

          {(effectiveRole === "GD" || effectiveRole === "DH") && (
            <>
              <Route path="/" element={<GdDhDashboard />} />
              <Route path="projects" element={<Projects />} />
            </>
          )}

          {(effectiveRole === "TL" || effectiveRole === "SM" || effectiveRole === "OIC") && (
            <Route path="/" element={<TlsmOicDashboard />} />
          )}

          {(effectiveRole === "STUDENT" || effectiveRole === "JRF" || effectiveRole === "SRF" || effectiveRole === "CE") && (
            <Route path="/" element={<StudentDashboard />} />
          )}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </>
  );
}

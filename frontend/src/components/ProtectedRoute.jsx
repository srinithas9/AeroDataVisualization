// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";


export default function ProtectedRoute({ element: Component, roles }) {
  const token = localStorage.getItem("aero_token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return Component;
}

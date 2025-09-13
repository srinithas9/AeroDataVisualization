// src/pages/LoginPage.jsx
import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Link,
  CircularProgress,
} from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch"; // ✈️ Aero avatar
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import RadialGraphic from "../components/RadialGraphic"; // ✅ old graphic back
import { useAuth } from "../context/AuthContext"; // ✅ bring in AuthContext

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginWithResponse } = useAuth(); // ✅ use our context
  const [form, setForm] = useState({
    userid: "",
    password: "",
    remember: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function validate() {
    const err = {};
    if (!form.userid?.trim()) err.userid = "User ID is required";
    if (!form.password) err.password = "Password is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: form.userid,
          password: form.password,
        }),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await res.json();

      // ✅ store in AuthContext (token + role + privileges)
      loginWithResponse({
        access_token: data.access_token,
        role: data.role,
        role_type: data.role_type,
        privileges: data.privileges,
      });

      // ✅ also persist to storage if "remember me" checked
      const storage = form.remember ? localStorage : sessionStorage;
      storage.setItem("aero_token", data.access_token);
      storage.setItem("role", data.role);
      storage.setItem("role_type", data.role_type);
      storage.setItem("privileges", JSON.stringify(data.privileges));

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setServerError(err.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="app-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: 16,
        background: "linear-gradient(135deg, #5a9efc 0%, #2d6fe0 100%)", // ✅ blue gradient like screenshot
      }}
    >
      <Card
        elevation={8}
        sx={{
          p: 4,
          borderRadius: 4,
          maxWidth: 900,
          width: "100%",
          backgroundColor: "white",
        }}
      >
        <Box display="flex" alignItems="center">
          {/* Left column: form */}
          <Box flex={1} pr={3}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
              <Avatar sx={{ bgcolor: "#2d6fe0" }}>
                <RocketLaunchIcon />
              </Avatar>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "#2d6fe0", fontWeight: 600 }}
                >
                  Aero Data Visualization
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
                  Login
                </Typography>
              </Box>
            </Box>

            <Box component="form" noValidate onSubmit={handleSubmit}>
              <TextField
                fullWidth
                name="userid"
                label="User ID"
                placeholder="Enter your User ID"
                size="small"
                value={form.userid}
                onChange={handleChange}
                error={!!errors.userid}
                helperText={errors.userid}
                sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 20 } }}
              />

              <TextField
                fullWidth
                name="password"
                label="Password"
                placeholder="Enter your password"
                size="small"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                sx={{ mb: 1.5, "& .MuiOutlinedInput-root": { borderRadius: 20 } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((s) => !s)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.remember}
                      name="remember"
                      onChange={handleChange}
                    />
                  }
                  label={<Typography variant="body2">Remember me</Typography>}
                />
                <Link component="button" variant="body2">
                  Forgot Password?
                </Link>
              </Box>

              {serverError && (
                <Typography color="error" variant="body2" sx={{ mb: 1 }}>
                  {serverError}
                </Typography>
              )}

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.6,
                  borderRadius: 6,
                  backgroundColor: "#2d6fe0", // ✅ solid blue button
                  fontWeight: "bold",
                  fontSize: "1rem",
                  "&:hover": {
                    backgroundColor: "#1e5bc9",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Login"
                )}
              </Button>
            </Box>
          </Box>

          {/* Right column: Radial graphic (back) */}
          <Box
            flex={1}
            sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <RadialGraphic size={380} />
          </Box>
        </Box>
      </Card>
    </div>
  );
}

// Login page.tsx file

"use client";

import {
  Box,
  Card,
  TextField,
  Typography,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    let hasError = false;

    // reset errors
    setEmailError("");
    setPasswordError("");

    // Email validation
    if (!email) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError("Enter a valid email (e.g. user@gmail.com)");
      hasError = true;
    }

    // Password validation
    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      hasError = true;
    }

    if (hasError) return;

    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:8000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.access_token);

        localStorage.setItem("refresh_token", data.refresh_token);

        localStorage.setItem("user_id", String(data.user_id));

        localStorage.setItem("user_name", data.user_name);

        setSnackbarMsg("Login successful");
        setSeverity("success");
        setSnackbarOpen(true);

        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        setSnackbarMsg(data.detail || "Invalid credentials");
        setSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.log(err);
      setSnackbarMsg("Something went wrong");
      setSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#12121c",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          width: 400,
          p: 4,
          borderRadius: 3,
          backgroundColor: "#1e1e2f",
          boxShadow: "0px 8px 30px rgba(0,0,0,0.5)",
        }}
      >
        {/* TITLE */}
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          sx={{ mb: 1, color: "#7c4dff" }}
        >
          MeetSpace Login
        </Typography>

        {/* EMAIL */}
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!emailError}
          helperText={emailError}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "#fff",
              "& fieldset": {
                borderColor: "#555",
                borderRadius: 2,
              },
              "&:hover fieldset": {
                borderColor: "#7c4dff",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#7c4dff",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#aaa",
            },
          }}
        />

        {/* PASSWORD */}
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!passwordError}
          helperText={passwordError}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "#fff",
              "& fieldset": {
                borderColor: "#555",
                borderRadius: 2,
              },
              "&:hover fieldset": {
                borderColor: "#7c4dff",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#7c4dff",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#aaa",
            },
          }}
        />

        {/* BUTTON */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          disabled={loading}
          sx={{
            mt: 2,
            py: 1.2,
            borderRadius: 2,
            textTransform: "none",
            background: "linear-gradient(55deg, #7340ff, #a674fd)",
            "&:hover": {
              background: "linear-gradient(55deg, #5f30e0, #8e5ae8)",
            },
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <Typography
          textAlign="center"
          sx={{ mt: 2, fontSize: 14, color: "#aaa" }}
        >
          New user?{" "}
          <Link href="/register" style={{ color: "#7c4dff" }}>
            Register
          </Link>
        </Typography>

        <Typography
          textAlign="center"
          sx={{ mt: 1, fontSize: 14, color: "#aaa" }}
        >
          <Link href="/forgot-password" style={{ color: "#7c4dff" }}>
            Forgot password?
          </Link>
        </Typography>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert severity={severity} variant="filled">
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

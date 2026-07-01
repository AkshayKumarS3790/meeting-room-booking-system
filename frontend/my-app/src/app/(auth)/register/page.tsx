// Register page.tsx file

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

export default function RegisterPage() {
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");

  const [userNameError, setUserNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(password);

  const handleRegister = async () => {
    let hasError = false;

    // reset errors
    setUserNameError("");
    setEmailError("");
    setPasswordError("");

    // Username
    if (!userName) {
      setUserNameError("Username is required");
      hasError = true;
    }

    // Email
    if (!email) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError("Enter a valid email (e.g. user@gmail.com)");
      hasError = true;
    }

    // Password
    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    } else if (!validatePassword(password)) {
      setPasswordError(
        "Min 6 chars, include uppercase, lowercase, number & special char",
      );
      hasError = true;
    }

    if (hasError) return;

    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:8000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: userName,
          email,
          password,
          role: "user",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSnackbarMsg("Registration successful");
        setSeverity("success");
        setSnackbarOpen(true);

        setTimeout(() => {
          router.push("/login");
        }, 1200);
      } else {
        setSnackbarMsg(data.detail || "Registration failed");
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
          width: 420,
          p: 4,
          backgroundColor: "#1e1e2f",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          sx={{ mb: 1, color: "#7c4dff" }}
        >
          Register
        </Typography>

        <TextField
          fullWidth
          label="User Name"
          margin="normal"
          required
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          error={!!userNameError}
          helperText={userNameError}
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

        <TextField
          fullWidth
          label="Email"
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

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, textTransform: "none", borderRadius: 2 }}
          onClick={handleRegister}
        >
          {loading ? "Registering..." : "Register"}
        </Button>
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

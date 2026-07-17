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
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import FloatingOrbs from "@/components/ui/FloatingOrbs";

type TokenPayload = {
  user_id: number;
  user_name: string;
};

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

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      if (decoded.exp * 1000 > Date.now()) {
        router.replace("/dashboard");
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
    }
  }, [router]);

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

      const res = await fetch("http://127.0.0.1:8000/api/v1/users/login", {
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

        const decoded = jwtDecode<TokenPayload>(data.access_token);

        localStorage.setItem("user_id", String(decoded.user_id));
        localStorage.setItem("user_name", String(decoded.user_name));

        setSnackbarMsg("Login successful");
        setSeverity("success");
        setSnackbarOpen(true);

        setTimeout(() => {
          router.push("/dashboard");
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
      <FloatingOrbs />

      <Card
        sx={{
          width: {
            xs: "80%",
            sm: 450,
            md: 750,
            lg: 850,
          },

          minHeight: {
            xs: "auto",
            md: 500,
          },

          display: "flex",

          flexDirection: {
            xs: "column",
            md: "row",
          },

          background: "linear-gradient(180deg, #1c1c3b 0%, #16162a 100%)",

          position: "relative",
          zIndex: 1,

          borderRadius: 4,
          overflow: "hidden",

          boxShadow: "0px 10px 30px rgba(0,0,0,0.4)",
        }}
      >
        <Box
          sx={{
            width: {
              xs: "100%",
              md: "50%",
            },
            background: "linear-gradient(135deg, #a674fd, #7340ff)",
            color: "#fff",
            p: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "2rem",
                md: "3rem",
              },
              fontWeight: "bold",
              lineHeight: 1.2,
              maxWidth: 450,
            }}
          >
            Welcome to Meetspace
          </Typography>

          <Typography
            sx={{
              mt: 2,
              lineHeight: 2,
              fontSize: {
                xs: "0.9rem",
                md: "1.0rem",
              },
              textAlign: "left",
            }}
          >
            <b>• Book meeting rooms easily</b>
            <br />
            <b>• Manage room availability</b>
            <br />
            <b>• Track upcoming bookings</b>
            <br />
          </Typography>
        </Box>

        <Box
          sx={{
            width: {
              xs: "100%",
              md: "60%",
            },
            p: {
              xs: 3,
              md: 5,
            },

            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* TITLE */}
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            sx={{
              color: "#7c4dff",
              mb: 1,
              fontSize: {
                xs: "2rem",
                md: "3rem",
              },
            }}
          >
            Login
          </Typography>

          <Typography
            textAlign="center"
            sx={{
              color: "#aaa",
              mb: 1,
              fontSize: {
                xs: "0.9rem",
                md: "1.0rem",
              },
            }}
          >
            Sign in to access your workspace
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
            onClick={handleLogin}
            disabled={loading}
            variant="contained"
            sx={{
              mt: 2,
              py: 1,

              fontSize: {
                xs: "0.9rem",
                md: "1.0rem",
              },
              fontWeight: 600,

              textTransform: "none",

              borderRadius: 2,

              background: "linear-gradient(90deg, #7c4dff, #9b6dff)",

              "&:hover": {
                background: "linear-gradient(90deg, #7340ff, #8f63ff)",
              },
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>

          <Typography
            textAlign="center"
            sx={{
              mt: 2,
              color: "#aaa",
              fontSize: {
                xs: "0.9rem",
                md: "1.0rem",
              },
            }}
          >
            Don&apos;t have an account?{" "}
            <Typography
              component="span"
              sx={{
                color: "#7c4dff",
                cursor: "pointer",
                fontWeight: 600,

                "&:hover": {
                  textDecoration: "underline",
                },
              }}
              onClick={() => router.push("/register")}
            >
              Register
            </Typography>
          </Typography>
        </Box>
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

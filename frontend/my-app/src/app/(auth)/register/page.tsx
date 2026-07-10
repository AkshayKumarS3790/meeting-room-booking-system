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

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [loading, setLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");

  const [userNameError, setUserNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPasswordHelp, setShowPasswordHelp] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(password);

  const passwordRules = {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  };

  const handleRegister = async () => {
    let hasError = false;

    // reset errors
    setUserNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

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

    // Validate Confirm Password
    if (!confirmPassword) {
      setConfirmPasswordError("Confirm password is required");
      hasError = true;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
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
          width: {
            xs: "90%",
            sm: 450,
          },
          maxWidth: 450,
          p: 4,
          background: "linear-gradient(180deg, #1c1c3b 0%, #16162a 100%)",
          borderRadius: 4,
          overflow: "visible",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          sx={{
            mb: 1,
            color: "#7c4dff",
          }}
        >
          Sign Up
        </Typography>

        <Typography
          textAlign="center"
          sx={{
            color: "#aaa",
            mb: 1,
          }}
        >
          Create your account to continue
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
          label="Enter your Email"
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

        <Box sx={{ position: "relative" }}>
          <TextField
            fullWidth
            label="Choose Password"
            type="password"
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setShowPasswordHelp(true)}
            onBlur={() => setTimeout(() => setShowPasswordHelp(false), 200)}
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

          {showPasswordHelp && (
            <Box
              sx={{
                position: "absolute",
                left: "calc(100% + 20px)",
                top: "50%",
                transform: "translateY(-50%)",

                zIndex: 10,

                width: 280,

                background: "linear-gradient(180deg, #1c1c3b 0%, #16162a 100%)",
                border: "1px solid #444",
                borderRadius: 2,

                p: 2,

                boxShadow: "0px 8px 25px rgba(0,0,0,0.5)",

                "&::before": {
                  content: '""',
                  position: "absolute",

                  left: -8,
                  top: "50%",

                  transform: "translateY(-50%) rotate(45deg)",

                  width: 16,
                  height: 16,

                  background:
                    "linear-gradient(180deg, #1c1c3b 0%, #16162a 100%)",

                  borderLeft: "1px solid #444",
                  borderBottom: "1px solid #444",
                },
              }}
            >
              <Typography
                sx={{
                  color: "#fff",
                  mb: 1,
                  fontWeight: 600,
                }}
              >
                Password must include:
              </Typography>

              <Typography color={passwordRules.length ? "#24cd3e" : "#f23737"}>
                {passwordRules.length ? "✓" : "✗"} At least 6 characters
              </Typography>

              <Typography
                color={passwordRules.uppercase ? "#24cd3e" : "#f23737"}
              >
                {passwordRules.uppercase ? "✓" : "✗"} One uppercase letter
              </Typography>

              <Typography
                color={passwordRules.lowercase ? "#24cd3e" : "#f23737"}
              >
                {passwordRules.lowercase ? "✓" : "✗"} One lowercase letter
              </Typography>

              <Typography color={passwordRules.number ? "#24cd3e" : "#f23737"}>
                {passwordRules.number ? "✓" : "✗"} One number
              </Typography>

              <Typography color={passwordRules.special ? "#24cd3e" : "#f23737"}>
                {passwordRules.special ? "✓" : "✗"} One special character
              </Typography>
            </Box>
          )}
        </Box>

        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          margin="normal"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={!!confirmPasswordError}
          helperText={confirmPasswordError}
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
          onClick={handleRegister}
          sx={{
            mt: 2,
            py: 1,

            fontSize: "1rem",
            fontWeight: 600,

            textTransform: "none",

            borderRadius: 2,

            background: "linear-gradient(90deg, #7c4dff, #9b6dff)",

            "&:hover": {
              background: "linear-gradient(90deg, #7340ff, #8f63ff)",
            },
          }}
        >
          {loading ? "Registering..." : "Register"}
        </Button>

        <Typography
          textAlign="center"
          sx={{
            mt: 2,
            color: "#aaa",
          }}
        >
          Already have an account?{" "}
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
            onClick={() => router.push("/login")}
          >
            Login
          </Typography>
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

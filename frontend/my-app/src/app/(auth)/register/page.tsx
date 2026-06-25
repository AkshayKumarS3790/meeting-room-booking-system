// Register page.tsx file

"use client";

import { Box, Card, TextField, Typography, Button } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
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
        alert("User registered successfully");
        router.push("/login");
      } else {
        alert(data.detail || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
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
          textAlign="center"
          sx={{ mb: 1, color: "#7c4dff" }}
        >
          Register
        </Typography>

        <TextField
          fullWidth
          label="User Name"
          margin="normal"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          Register
        </Button>
      </Card>
    </Box>
  );
}

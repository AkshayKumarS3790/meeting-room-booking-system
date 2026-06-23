// Login page.tsx file

"use client";

import { Box, Card, TextField, Typography, Button } from "@mui/material";

export default function LoginPage() {
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
          sx={{ mb: 3, color: "#7c4dff" }}
        >
          MeetSpace Login
        </Typography>

        {/* EMAIL */}
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "#fff",
              "& fieldset": {
                borderColor: "#555",
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
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "#fff",
              "& fieldset": {
                borderColor: "#555",
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
          sx={{
            mt: 3,
            py: 1.2,
            borderRadius: 2,
            textTransform: "none",
            background: "linear-gradient(55deg, #7340ff, #a674fd)",
            "&:hover": {
              background: "linear-gradient(55deg, #5f30e0, #8e5ae8)",
            },
          }}
        >
          Login
        </Button>

        {/* OPTIONAL */}
        <Typography
          textAlign="center"
          sx={{ mt: 2, fontSize: 14, color: "#aaa" }}
        >
          Forgot password?
        </Typography>
      </Card>
    </Box>
  );
}

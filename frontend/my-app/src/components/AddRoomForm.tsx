"use client";

import { useState } from "react";
import { TextField, Button, Box, Snackbar, Alert } from "@mui/material";
import { useAddRoomMutation } from "../services/api";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export default function AddRoomForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    room_name: "",
    capacity: "",
    location: "",
  });

  const [addRoom] = useAddRoomMutation();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [msg, setMsg] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");

  const [roomError, setRoomError] = useState("");

  const isValid =
    form.room_name.trim() !== "" &&
    Number(form.capacity) > 0 &&
    form.location.trim() !== "";

  const handleSubmit = async () => {
    try {
      await addRoom({
        room_name: form.room_name,
        capacity: Number(form.capacity),
        location: form.location,
      }).unwrap();

      setMsg("Room added successfully");
      setSeverity("success");
      setOpenSnackbar(true);

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      const error = err as FetchBaseQueryError;

      let message = "Failed to add room";

      if ("data" in error) {
        const errData = error.data as { detail?: string };
        message = errData?.detail || message;
      }

      setMsg(message);
      setSeverity("error");
      setOpenSnackbar(true);

      if (message.toLowerCase().includes("exists")) {
        setRoomError("Room already exists");
      }
    }
  };

  return (
    <Box mt={2}>
      <TextField
        label="Room Name"
        required
        fullWidth
        value={form.room_name}
        onChange={(e) => {
          setForm({ ...form, room_name: e.target.value });
          setRoomError("");
        }}
        error={!!roomError}
        helperText={roomError}
        sx={{
          mb: 2,

          "& .MuiOutlinedInput-root": {
            backgroundColor: "#37374c",
            color: "#fff",
            borderRadius: 2,

            "& fieldset": {
              borderColor: "#444",
            },

            "&:hover fieldset": {
              borderColor: "#7c4dff",
            },

            "&.Mui-focused fieldset": {
              borderColor: "#7c4dff",
              borderWidth: "2px",
            },
          },

          "& .MuiInputLabel-root": {
            color: "#aaa",
          },

          "& .MuiInputLabel-root.Mui-focused": {
            color: "#b388ff",
          },
        }}
      />

      <TextField
        label="Capacity"
        required
        fullWidth
        value={form.capacity}
        onChange={(e) => setForm({ ...form, capacity: e.target.value })}
        inputProps={{ min: 1 }}
        sx={{
          mb: 2,

          "& .MuiOutlinedInput-root": {
            backgroundColor: "#37374c",
            color: "#fff",
            borderRadius: 2,

            "& fieldset": {
              borderColor: "#444",
            },

            "&:hover fieldset": {
              borderColor: "#7c4dff",
            },

            "&.Mui-focused fieldset": {
              borderColor: "#7c4dff",
              borderWidth: "2px",
            },
          },

          "& .MuiInputLabel-root": {
            color: "#aaa",
          },

          "& .MuiInputLabel-root.Mui-focused": {
            color: "#b388ff",
          },
        }}
      />

      <TextField
        label="Location"
        required
        fullWidth
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
        sx={{
          mb: 1,

          "& .MuiOutlinedInput-root": {
            backgroundColor: "#37374c",
            color: "#fff",
            borderRadius: 2,

            "& fieldset": {
              borderColor: "#444",
            },

            "&:hover fieldset": {
              borderColor: "#7c4dff",
            },

            "&.Mui-focused fieldset": {
              borderColor: "#7c4dff",
              borderWidth: "2px",
            },
          },

          "& .MuiInputLabel-root": {
            color: "#aaa",
          },

          "& .MuiInputLabel-root.Mui-focused": {
            color: "#b388ff",
          },
        }}
      />

      <Box display="flex" gap={2} mt={1}>
        <Button
          className="primary-btn"
          variant="contained"
          disabled={!isValid}
          onClick={handleSubmit}
          sx={{ mb: 2, borderRadius: 2, textTransform: "none" }}
        >
          Add Room
        </Button>

        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ mb: 2, borderRadius: 2, textTransform: "none" }}
        >
          Cancel
        </Button>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          severity={severity}
          variant="filled"
          sx={{ borderRadius: 2, fontWeight: "medium" }}
        >
          {msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

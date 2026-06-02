"use client";

import { useState } from "react";
import { TextField, Button, Box, Snackbar, Alert } from "@mui/material";
import { useAddRoomMutation } from "../services/api";

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
    } catch {
      setMsg("Failed to add room");
      setSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box mt={2}>
      <TextField
        label="Room Name"
        required
        fullWidth
        value={form.room_name}
        onChange={(e) => setForm({ ...form, room_name: e.target.value })}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Capacity"
        required
        fullWidth
        value={form.capacity}
        onChange={(e) => setForm({ ...form, capacity: e.target.value })}
        inputProps={{ min: 1 }}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Location"
        required
        fullWidth
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        fullWidth
        disabled={!isValid}
        onClick={handleSubmit}
        sx={{ mb: 1 }}
      >
        Add Room
      </Button>

      <Button onClick={onClose} variant="outlined" fullWidth>
        Cancel
      </Button>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={severity} variant="filled">
          {msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

"use client";

import { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useUpdateRoomMutation, useDeleteRoomMutation } from "../services/api";
import { Room } from "../services/api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";

export default function EditRoomForm({
  room,
  onClose,
}: {
  room: Room;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    capacity: room.capacity,
    location: room.location,
  });

  const [updateRoom, { isLoading }] = useUpdateRoomMutation();

  const [deleteRoom, deleteState] = useDeleteRoomMutation();
  const isDeleting = deleteState.isLoading;

  const [confirmDelete, setConfirmDelete] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [msg, setMsg] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");

  const isValid = Number(form.capacity) > 0 && form.location.trim() !== "";

  const handleSubmit = async () => {
    try {
      await updateRoom({
        room_name: room.room_name,
        capacity: Number(form.capacity),
        location: form.location,
      }).unwrap();

      setMsg("Room updated successfully");
      setSeverity("success");
      setOpenSnackbar(true);

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch {
      setMsg("Update failed");
      setSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRoom(room.room_name).unwrap();

      setMsg("Room deleted successfully");
      setSeverity("success");
      setOpenSnackbar(true);

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch {
      setMsg("Delete failed");
      setSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box mt={2}>
      <TextField
        label="Room Name"
        fullWidth
        disabled
        value={room.room_name}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Capacity"
        fullWidth
        required
        value={form.capacity}
        onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Location"
        fullWidth
        required
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
        sx={{ mb: 1 }}
      />

      <Box display="flex" gap={2} mt={1}>
        <Button
          variant="contained"
          fullWidth
          disabled={!isValid || isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? "Updating..." : "Update Room"}
        </Button>

        <Button
          variant="outlined"
          fullWidth
          color="error"
          disabled={isDeleting}
          onClick={() => setConfirmDelete(true)}
        >
          {isDeleting ? "Deleting..." : "Delete Room"}
        </Button>
      </Box>

      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Delete Room</DialogTitle>

        <DialogContent>
          Are you sure you want to delete this room?
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>

          <Button
            color="error"
            onClick={async () => {
              await handleDelete();
              setConfirmDelete(false);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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

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
  Typography,
} from "@mui/material";

export default function EditRoomForm({
  room,
  onClose,
  onSuccess,
}: {
  room: Room;
  onClose: () => void;
  onSuccess: (msg: string, type: "success" | "error") => void;
}) {
  const [form, setForm] = useState({
    capacity: room.capacity,
    location: room.location,
  });

  const [updateRoom, { isLoading }] = useUpdateRoomMutation();

  const [deleteRoom, deleteState] = useDeleteRoomMutation();
  const isDeleting = deleteState.isLoading;

  const [confirmDelete, setConfirmDelete] = useState(false);

  const isValid = Number(form.capacity) > 0 && form.location.trim() !== "";

  const handleSubmit = async () => {
    try {
      await updateRoom({
        room_name: room.room_name,
        capacity: Number(form.capacity),
        location: form.location,
      }).unwrap();

      onSuccess("Room updated successfully", "success");

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch {
      onSuccess("Update failed", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRoom(room.room_name).unwrap();

      console.log("DELETE SUCCESS");

      setConfirmDelete(false);

      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      console.log("DELETE FAILED", err);

      onSuccess("Delete failed", "error");
    }
  };

  return (
    <Box mt={2}>
      <TextField
        label="Room Name"
        fullWidth
        disabled
        value={room.room_name}
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />
      <TextField
        label="Capacity"
        fullWidth
        required
        value={form.capacity}
        onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />
      <TextField
        label="Location"
        fullWidth
        required
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />

      <Box display="flex" gap={2} mt={1}>
        <Button
          variant="contained"
          fullWidth
          disabled={!isValid || isLoading}
          onClick={handleSubmit}
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          {isLoading ? "Updating..." : "Update Room"}
        </Button>

        <Button
          variant="outlined"
          fullWidth
          color="error"
          disabled={isDeleting}
          onClick={() => setConfirmDelete(true)}
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          {isDeleting ? "Deleting..." : "Delete Room"}
        </Button>
      </Box>

      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Delete Room</DialogTitle>

        <DialogContent>
          <Typography>Are you sure you want to delete this room?</Typography>

          <Typography sx={{ color: "red" }}>
            ⚠️ All bookings for this room will also be deleted.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setConfirmDelete(false)}
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            sx={{ borderRadius: 2, textTransform: "none" }}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

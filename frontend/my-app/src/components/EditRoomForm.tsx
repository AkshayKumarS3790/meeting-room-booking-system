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
          mb: 3,

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

          "& .Mui-disabled": {
            WebkitTextFillColor: "#ccc",
            color: "#ccc",
            opacity: 1,
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
        fullWidth
        required
        value={form.capacity}
        onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
        sx={{
          mb: 3,

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
        fullWidth
        required
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
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

      <Box display="flex" gap={2} mt={1}>
        <Button
          variant="contained"
          fullWidth
          disabled={!isValid || isLoading}
          onClick={handleSubmit}
          sx={{
            background: "linear-gradient(55deg, #7e4fff, #ad7eff)",
            color: "#fff",
            borderRadius: 2,
            textTransform: "none",
            padding: "6px 14px",

            "&:hover": {
              background: "linear-gradient(55deg, #7340ff, #a674fd)",
            },
          }}
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

      <Dialog
        open={confirmDelete}
        disableScrollLock
        PaperProps={{
          sx: {
            backgroundColor: "#1e1e2f",
            color: "#fff",
            borderRadius: 3,
            padding: 2,
          },
        }}
        onClose={() => setConfirmDelete(false)}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Delete Room</DialogTitle>

        <DialogContent>
          <Typography>Are you sure you want to delete this room?</Typography>

          <Typography sx={{ color: "#fc5d5d", fontStyle: "italic" }}>
            All bookings for this room will also be deleted.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setConfirmDelete(false)}
            sx={{
              background: "linear-gradient(55deg, #7e4fff, #ad7eff)",
              color: "#fff",
              borderRadius: 2,
              textTransform: "none",
              padding: "6px 14px",

              "&:hover": {
                background: "linear-gradient(55deg, #7340ff, #a674fd)",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="outlined"
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

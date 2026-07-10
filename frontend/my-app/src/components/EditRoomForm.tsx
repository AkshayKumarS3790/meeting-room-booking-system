"use client";

import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useUpdateRoomMutation, useDeleteRoomMutation } from "../redux/api";
import { Room } from "../redux/api";

import ConfirmDialog from "./common/ConfirmDialog";
import DangerButton from "./common/DangerButton";
import DarkTextField from "./common/DarkTextField";
import PrimaryButton from "./common/PrimaryButton";
import AppSnackbar from "./common/AppSnackbar";

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

  const [deleteRoom, { isLoading: isDeleting }] = useDeleteRoomMutation();

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
    } catch (error) {
      const err = error as {
        data?: {
          detail?: string;
        };
      };
      setMsg(err.data?.detail || "Update failed");
      setSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRoom(room.room_name).unwrap();

      console.log("DELETE SUCCESS");

      onSuccess("Room deleted successfully", "success");

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
      <DarkTextField
        label="Room Name"
        fullWidth
        disabled
        value={room.room_name}
        sx={{
          mb: 3,

          "& .Mui-disabled": {
            WebkitTextFillColor: "#ccc",
            color: "#ccc",
            opacity: 1,
          },
        }}
      />

      <DarkTextField
        label="Capacity"
        fullWidth
        required
        value={form.capacity}
        onChange={(e) =>
          setForm({
            ...form,
            capacity: Number(e.target.value),
          })
        }
        sx={{ mb: 3 }}
      />

      <DarkTextField
        label="Location"
        fullWidth
        required
        value={form.location}
        onChange={(e) =>
          setForm({
            ...form,
            location: e.target.value,
          })
        }
      />

      <Box display="flex" gap={2} mt={1}>
        <PrimaryButton
          fullWidth
          disabled={!isValid || isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? "Updating..." : "Update Room"}
        </PrimaryButton>

        <DangerButton
          fullWidth
          disabled={isDeleting}
          onClick={() => setConfirmDelete(true)}
        >
          {isDeleting ? "Deleting..." : "Delete Room"}
        </DangerButton>
      </Box>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete Room"
        message="Are you sure you want to delete this room?"
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
      >
        <Typography
          sx={{
            color: "#fc5d5d",
            fontStyle: "italic",
            mt: 1,
          }}
        >
          All bookings for this room will also be deleted.
        </Typography>
      </ConfirmDialog>

      <AppSnackbar
        open={openSnackbar}
        message={msg}
        severity={severity}
        onClose={() => setOpenSnackbar(false)}
      />
    </Box>
  );
}

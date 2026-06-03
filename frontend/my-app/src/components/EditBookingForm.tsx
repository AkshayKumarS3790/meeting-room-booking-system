"use client";

import { useState } from "react";
import { TextField, Button, Box, Snackbar, Alert } from "@mui/material";
import { Booking, useUpdateBookingMutation } from "../services/api";

export default function EditBookingForm({
  booking,
  onClose,
  room_capacity,
}: {
  booking: Booking;
  onClose: () => void;
  room_capacity: number;
}) {
  const [form, setForm] = useState({
    user_id: booking.user_id,
    purpose: booking.purpose,
    date: booking.start_date_time.split(" ")[0],
    start_time: booking.start_date_time.split(" ")[1],
    end_time: booking.end_date_time.split(" ")[1],
    required_capacity: booking.required_capacity,
    room_name: booking.room_name,
  });

  const [updateBooking] = useUpdateBookingMutation();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [msg, setMsg] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");

  const capacityExceeded = Number(form.required_capacity) > room_capacity;

  const handleSubmit = async () => {
    if (capacityExceeded) {
      setMsg(
        `Room ${booking.room_name} cannot accommodate more than ${room_capacity} people`,
      );
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      await updateBooking({
        booking_id: booking.booking_id,
        user_id: form.user_id,
        purpose: form.purpose,
        required_capacity: Number(form.required_capacity),
        room_name: form.room_name,
        start_date_time: `${form.date} ${form.start_time}`,
        end_date_time: `${form.date} ${form.end_time}`,
      }).unwrap();

      setMsg("Booking updated successfully");
      setSeverity("success");
      setOpenSnackbar(true);

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch {
      setMsg("Update failed");
      setSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} mt={2}>
      <TextField
        label="Purpose"
        required
        value={form.purpose}
        onChange={(e) => setForm({ ...form, purpose: e.target.value })}
      />

      <TextField
        label="Date"
        type="date"
        required
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        InputLabelProps={{ shrink: true }}
      />

      <Box display="flex" gap={2}>
        <TextField
          label="Start Time"
          type="time"
          required
          value={form.start_time}
          onChange={(e) => setForm({ ...form, start_time: e.target.value })}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="End Time"
          type="time"
          required
          value={form.end_time}
          onChange={(e) => setForm({ ...form, end_time: e.target.value })}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      <TextField
        label="Capacity"
        required
        value={form.required_capacity}
        onChange={(e) =>
          setForm({
            ...form,
            required_capacity: Number(e.target.value),
          })
        }
        error={capacityExceeded}
        helperText={
          capacityExceeded
            ? `Room ${booking.room_name} cannot accommodate more than ${room_capacity} people`
            : ""
        }
      />

      <Button variant="contained" onClick={handleSubmit}>
        Update Booking
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

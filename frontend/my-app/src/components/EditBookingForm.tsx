"use client";

import { useState } from "react";

import { Box } from "@mui/material";

import DarkTextField from "./common/DarkTextField";
import PrimaryButton from "./common/PrimaryButton";
import AppSnackbar from "./common/AppSnackbar";

import { Booking, useUpdateBookingMutation } from "../redux/api";

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

  const [updateBooking, { isLoading }] = useUpdateBookingMutation();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [msg, setMsg] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");

  const capacityExceeded = Number(form.required_capacity) > room_capacity;

  const now = new Date();

  const newStart =
    form.date && form.start_time
      ? new Date(`${form.date}T${form.start_time}`)
      : null;

  const newEnd =
    form.date && form.end_time
      ? new Date(`${form.date}T${form.end_time}`)
      : null;

  const isInvalidTimeRange =
    newStart !== null && newEnd !== null && newEnd <= newStart;

  const isPastTime = newStart !== null && newStart <= now;

  const handleSubmit = async () => {
    if (capacityExceeded) {
      setMsg(
        `Room ${booking.room_name} cannot accommodate more than ${room_capacity} people`,
      );
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (isPastTime) {
      setMsg("Cannot book room for past time");
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (isInvalidTimeRange) {
      setMsg("End time must be after start time");
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

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <Box display="flex" flexDirection="column" gap={2} mt={2}>
      <DarkTextField
        label="Purpose"
        required
        value={form.purpose}
        onChange={(e) =>
          setForm({
            ...form,
            purpose: e.target.value,
          })
        }
      />

      <DarkTextField
        label="Date"
        type="date"
        required
        value={form.date}
        inputProps={{
          min: todayStr,
        }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
        sx={{
          "& input::-webkit-calendar-picker-indicator": {
            filter: "invert(1)",
            cursor: "pointer",
          },
        }}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />

      <Box display="flex" gap={2}>
        <DarkTextField
          label="Start Time"
          type="time"
          required
          value={form.start_time}
          onChange={(e) => setForm({ ...form, start_time: e.target.value })}
          fullWidth
          slotProps={{
            inputLabel: { shrink: true },
          }}
          error={isPastTime || isInvalidTimeRange}
          helperText={
            isPastTime
              ? "Cannot select past time"
              : isInvalidTimeRange
                ? "Start time must be lesser than end time"
                : ""
          }
          sx={{
            "& input::-webkit-calendar-picker-indicator": {
              filter: "invert(1)",
              cursor: "pointer",
            },
          }}
        />

        <DarkTextField
          label="End Time"
          type="time"
          required
          value={form.end_time}
          onChange={(e) => setForm({ ...form, end_time: e.target.value })}
          fullWidth
          slotProps={{
            inputLabel: { shrink: true },
          }}
          error={isInvalidTimeRange}
          helperText={
            isInvalidTimeRange ? "End time must be greater than start time" : ""
          }
          sx={{
            "& input::-webkit-calendar-picker-indicator": {
              filter: "invert(1)",
              cursor: "pointer",
            },
          }}
        />
      </Box>

      <DarkTextField
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

      <PrimaryButton
        onClick={handleSubmit}
        disabled={isLoading}
        sx={{
          alignSelf: "flex-start",
          px: 2,
        }}
      >
        {isLoading ? "Updating..." : "Update Booking"}
      </PrimaryButton>

      <AppSnackbar
        open={openSnackbar}
        message={msg}
        severity={severity}
        onClose={() => setOpenSnackbar(false)}
      />
    </Box>
  );
}

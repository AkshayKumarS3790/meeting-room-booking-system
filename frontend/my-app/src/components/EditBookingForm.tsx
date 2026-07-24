"use client";

import { useState } from "react";

import { Box, CircularProgress } from "@mui/material";

import AppSnackbar from "./common/AppSnackbar";
import DarkTextField from "./common/DarkTextField";
import PrimaryButton from "./common/PrimaryButton";

import { Booking, useUpdateBookingMutation } from "../redux/api";

import { datePickerFieldSx } from "@/utils/datePickerFieldSx";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

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

  return (
    <Box display="flex" flexDirection="column" gap={1} mt={1}>
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

      <DatePicker
        label="Date"
        value={dayjs(form.date)}
        disablePast
        onChange={(value) => {
          if (value) {
            setForm({
              ...form,
              date: value.format("YYYY-MM-DD"),
            });
          }
        }}
        slotProps={{
          textField: {
            fullWidth: true,
            required: true,
            sx: datePickerFieldSx,
          },
        }}
      />

      <Box display="flex" gap={2}>
        <TimePicker
          label="Start Time"
          value={dayjs(`2026-01-01T${form.start_time}`)}
          onChange={(value) => {
            if (value) {
              setForm({
                ...form,
                start_time: value.format("HH:mm"),
              });
            }
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              required: true,
              error: isPastTime || isInvalidTimeRange,
              helperText: isPastTime
                ? "Cannot select past time"
                : isInvalidTimeRange
                  ? "Start time must be lesser than end time"
                  : "",
              sx: datePickerFieldSx,
            },
          }}
        />

        <TimePicker
          label="End Time"
          value={dayjs(`2026-01-01T${form.end_time}`)}
          onChange={(value) => {
            if (value) {
              setForm({
                ...form,
                end_time: value.format("HH:mm"),
              });
            }
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              required: true,
              error: isInvalidTimeRange,
              helperText: isInvalidTimeRange
                ? "End time must be greater than start time"
                : "",
              sx: datePickerFieldSx,
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
        {isLoading ? (
          <>
            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
            Updating...
          </>
        ) : (
          "Update Booking"
        )}
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

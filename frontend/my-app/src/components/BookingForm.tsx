"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  useCreateBookingMutation,
  useGetUsersQuery,
  useGetBookingsQuery,
} from "../services/api";

export default function BookingForm({
  room_name,
  room_capacity,
  onSuccess,
}: {
  room_name: string;
  room_capacity: number;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    user_id: 0,
    purpose: "",
    date: "",
    start_time: "",
    end_time: "",
    required_capacity: "" as number | string,
    room_name: room_name,
  });

  const { data: users } = useGetUsersQuery();
  const { data: bookings } = useGetBookingsQuery();

  const [createBooking] = useCreateBookingMutation();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");
  // const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

  const isOverlapping =
    newStart !== null &&
    newEnd !== null &&
    Array.isArray(bookings) &&
    bookings.some((b) => {
      if (b.room_name !== room_name) return false;

      const existingStart = new Date(b.start_date_time);
      const existingEnd = new Date(b.end_date_time);

      return newStart < existingEnd && newEnd > existingStart;
    });

  const isPastTime = newStart !== null && newStart <= now;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedDate = form.date ? new Date(form.date) : null;

  const isPastDate = selectedDate !== null && selectedDate < today;

  const isFormValid =
    form.user_id > 0 &&
    form.purpose.trim() !== "" &&
    form.date !== "" &&
    form.start_time !== "" &&
    form.end_time !== "" &&
    Number(form.required_capacity) > 0;
  // !capacityExceeded &&
  // !isPastTime &&
  // !isOverlapping &&
  // !isInvalidTimeRange;

  const handleSubmit = async () => {
    // setHasSubmitted(true);

    if (
      !form.user_id ||
      !form.purpose ||
      !form.date ||
      !form.start_time ||
      !form.end_time
    ) {
      setSnackbarMsg("Please fill all fields");
      setSeverity("error");
      setOpenSnackbar(true);
      // setHasSubmitted(true);
      return;
    }

    if (isPastDate) {
      setSnackbarMsg("Cannot select a past date");
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (isPastTime) {
      setSnackbarMsg("Cannot book room for past time");
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (isInvalidTimeRange) {
      setSnackbarMsg("End time must be after start time");
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (isOverlapping) {
      setSnackbarMsg("This room is already booked during this time");
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const start_date_time = `${form.date} ${form.start_time}`;
      const end_date_time = `${form.date} ${form.end_time}`;

      await createBooking({
        ...form,
        user_id: Number(form.user_id),
        required_capacity: Number(form.required_capacity),
        start_date_time,
        end_date_time,
      }).unwrap();

      setSnackbarMsg("Booking successful");
      setSeverity("success");
      setOpenSnackbar(true);
      // setHasSubmitted(false);

      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch {
      setSnackbarMsg("Booking failed");
      setSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box mt={2}>
      <FormControl fullWidth sx={{ mb: 1 }}>
        <InputLabel>Select User</InputLabel>

        <Select
          name="user_id"
          value={form.user_id || ""}
          label="Select User"
          sx={{ mb: 1, borderRadius: 2 }}
          onChange={(e) =>
            setForm({ ...form, user_id: Number(e.target.value) })
          }
        >
          {users?.map((user) => (
            <MenuItem key={user.user_id} value={user.user_id}>
              {user.user_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Purpose"
        name="purpose"
        required
        variant="outlined"
        fullWidth
        onChange={handleChange}
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />
      <TextField
        label="Date"
        name="date"
        type="date"
        required
        fullWidth
        value={form.date}
        slotProps={{
          inputLabel: { shrink: true },
        }}
        onChange={handleChange}
        // error={hasSubmitted && isPastDate}
        error={isPastDate}
        helperText={
          // hasSubmitted &&
          isPastDate ? "Cannot select a past date" : ""
        }
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Start Time"
          name="start_time"
          type="time"
          required
          fullWidth
          value={form.start_time}
          slotProps={{ inputLabel: { shrink: true } }}
          onChange={handleChange}
          // error={hasSubmitted && (isPastTime || isInvalidTimeRange)}
          error={isPastTime || isInvalidTimeRange}
          helperText={
            // hasSubmitted &&
            isPastTime
              ? "Cannot select past time"
              : isInvalidTimeRange
                ? "Start time must be before end time"
                : ""
          }
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />

        <TextField
          label="End Time"
          name="end_time"
          type="time"
          required
          fullWidth
          value={form.end_time}
          slotProps={{ inputLabel: { shrink: true } }}
          onChange={handleChange}
          // error={hasSubmitted && isInvalidTimeRange}
          error={isInvalidTimeRange}
          helperText={
            // hasSubmitted &&
            isInvalidTimeRange ? "End time must be after start time" : ""
          }
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      </Box>

      {/* {hasSubmitted && isOverlapping && ( */}
      {/* {isOverlapping && (
        <Box color="error.main" mb={2}>
          This room is already booked for the selected time
        </Box>
      )} */}

      <TextField
        label="Capacity"
        name="required_capacity"
        required
        fullWidth
        value={form.required_capacity}
        onChange={(e) =>
          setForm({ ...form, required_capacity: e.target.value })
        }
        error={capacityExceeded}
        helperText={
          capacityExceeded
            ? `Room ${room_name} cannot accomodate more than ${room_capacity} people`
            : ""
        }
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={!isFormValid}
        sx={{ borderRadius: 2, textTransform: "none" }}
      >
        Confirm Booking
      </Button>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={severity} variant="filled">
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

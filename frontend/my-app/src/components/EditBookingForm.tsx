"use client";

import { useState } from "react";
import { TextField, Button, Box, Snackbar, Alert } from "@mui/material";
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

  // const today = new Date();
  // today.setHours(0, 0, 0, 0);

  // const selectedDate = form.date ? new Date(form.date) : null;

  // const isPastDate = selectedDate !== null && selectedDate < today;

  const handleSubmit = async () => {
    if (capacityExceeded) {
      setMsg(
        `Room ${booking.room_name} cannot accommodate more than ${room_capacity} people`,
      );
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    // if (isPastDate) {
    //   setMsg("Cannot select a past date");
    //   setSeverity("error");
    //   setOpenSnackbar(true);
    //   return;
    // }

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
      <TextField
        label="Purpose"
        required
        value={form.purpose}
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
        onChange={(e) => setForm({ ...form, purpose: e.target.value })}
      />

      <TextField
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
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        // error={isPastDate}
        // helperText={isPastDate ? "Cannot select a past date" : ""}

        sx={{
          mb: 1,

          "& .MuiOutlinedInput-root": {
            backgroundColor: "#37374c",
            color: "#fff",
            borderRadius: 2,

            "& fieldset": {
              borderColor: "#444",
            },

            "&.Mui-error fieldset": {
              borderColor: "#ff6b6b",
            },

            "&:hover fieldset": {
              borderColor: "#7c4dff",
            },

            "&.Mui-focused fieldset": {
              borderColor: "#7c4dff",
              borderWidth: "2px",
            },
          },

          "& .MuiFormHelperText-root.Mui-error": {
            color: "#ff8a80",
            fontSize: "0.75rem",
          },

          "& .MuiInputLabel-root": {
            color: "#aaa",
          },

          "& .MuiInputLabel-root.Mui-focused": {
            color: "#b388ff",
          },
        }}
      />

      <Box display="flex" gap={2}>
        <TextField
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
            mb: 1,

            "& .MuiOutlinedInput-root": {
              backgroundColor: "#37374c",
              color: "#fff",
              borderRadius: 2,

              "& fieldset": {
                borderColor: "#444",
              },

              "&.Mui-error fieldset": {
                borderColor: "#ff6b6b",
              },

              "&:hover fieldset": {
                borderColor: "#7c4dff",
              },

              "&.Mui-focused fieldset": {
                borderColor: "#7c4dff",
                borderWidth: "2px",
              },
            },

            "& .MuiFormHelperText-root.Mui-error": {
              color: "#ff8a80",
              fontSize: "0.75rem",
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
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#37374c",
              color: "#fff",
              borderRadius: 2,

              "& fieldset": {
                borderColor: "#444",
              },

              "&.Mui-error fieldset": {
                borderColor: "#ff6b6b",
              },

              "&:hover fieldset": {
                borderColor: "#7c4dff",
              },

              "&.Mui-focused fieldset": {
                borderColor: "#7c4dff",
                borderWidth: "2px",
              },
            },

            "& .MuiFormHelperText-root.Mui-error": {
              color: "#ff8a80",
              fontSize: "0.75rem",
            },

            "& .MuiInputLabel-root": {
              color: "#aaa",
            },

            "& .MuiInputLabel-root.Mui-focused": {
              color: "#b388ff",
            },
          }}
        />
      </Box>

      <TextField
        label="Capacity"
        required
        value={form.required_capacity}
        sx={{
          mb: 1,

          "& .MuiOutlinedInput-root": {
            backgroundColor: "#37374c",
            color: "#fff",
            borderRadius: 2,

            "& fieldset": {
              borderColor: "#444",
            },

            "&.Mui-error fieldset": {
              borderColor: "#ff6b6b",
            },

            "&:hover fieldset": {
              borderColor: "#7c4dff",
            },

            "&.Mui-focused fieldset": {
              borderColor: "#7c4dff",
              borderWidth: "2px",
            },
          },

          "& .MuiFormHelperText-root.Mui-error": {
            color: "#ff8a80",
            fontSize: "0.75rem",
          },

          "& .MuiInputLabel-root": {
            color: "#aaa",
          },

          "& .MuiInputLabel-root.Mui-focused": {
            color: "#b388ff",
          },
        }}
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

      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={isLoading}
        sx={{
          background: "linear-gradient(55deg, #7340ff, #a674fd)",
          color: "#fff",
          borderRadius: 2,
          textTransform: "none",
          alignSelf: "flex-start",

          padding: "6px 16px",

          transition: "0.3s ease",

          "&:hover": {
            background: "linear-gradient(55deg, #7340ff, #a674fd)",
          },

          "&.Mui-disabled": {
            background: "#444",
            color: "#999",
          },
        }}
      >
        {isLoading ? "Updating..." : "Update Booking"}
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

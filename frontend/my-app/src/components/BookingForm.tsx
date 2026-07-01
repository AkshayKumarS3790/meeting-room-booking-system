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
} from "../redux/api";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormHelperText } from "@mui/material";

export default function BookingForm({
  room_name,
  room_capacity,
  onSuccess,
}: {
  room_name: string;
  room_capacity: number;
  onSuccess: () => void;
}) {
  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const bookingSchema = z.object({
    user_id: z.coerce
      .number({
        invalid_type_error: "User is required",
      })
      .min(1, "User is required"),

    purpose: z.string().min(1, "Purpose is required"),
    date: z.string().min(1, "Date is required"),
    start_time: z.string().min(1, "Start time is required"),
    end_time: z.string().min(1, "End time is required"),

    required_capacity: z.coerce
      .number({
        invalid_type_error: "Capacity is required",
      })
      .min(1, "Capacity must be greater than 0"),
  });

  type BookingFormData = z.infer<typeof bookingSchema>;

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    watch,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      date: getTodayDate(),
    },
  });

  const date = watch("date");
  const start_time = watch("start_time");
  const end_time = watch("end_time");
  const required_capacity = watch("required_capacity");

  const { data: users } = useGetUsersQuery();
  const { data: bookings } = useGetBookingsQuery({});

  const [createBooking, { isLoading }] = useCreateBookingMutation();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");

  const capacityExceeded = Number(required_capacity) > room_capacity;

  const now = new Date();

  const newStart =
    date && start_time ? new Date(`${date}T${start_time}`) : null;

  const newEnd = date && end_time ? new Date(`${date}T${end_time}`) : null;

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

  const handleSubmit = async (data: BookingFormData) => {
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
      const start_date_time = `${data.date} ${data.start_time}`;
      const end_date_time = `${data.date} ${data.end_time}`;

      await createBooking({
        user_id: data.user_id,
        purpose: data.purpose,
        required_capacity: data.required_capacity,
        room_name,
        start_date_time,
        end_date_time,
      }).unwrap();

      setSnackbarMsg("Booking successful");
      setSeverity("success");
      setOpenSnackbar(true);

      setTimeout(onSuccess, 1500);
    } catch {
      setSnackbarMsg("Booking failed");
      setSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <Box mt={2}>
      <form onSubmit={handleFormSubmit(handleSubmit)} noValidate>
        <FormControl
          fullWidth
          error={!!errors.user_id}
          sx={{
            mb: 2,

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

            "& .MuiSvgIcon-root": {
              color: "#aaa",
            },
          }}
        >
          <InputLabel>Select User</InputLabel>

          <Select
            defaultValue=""
            label="Select User"
            {...register("user_id", { valueAsNumber: true })}
            MenuProps={{
              disableScrollLock: true,
              disablePortal: true,

              container: document.body,

              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },

              PaperProps: {
                sx: {
                  backgroundColor: "#37374c",
                  color: "#fff",
                  borderRadius: 2,
                  mt: 1,
                  maxHeight: 350,
                  minWidth: "100%",
                  overflowY: "auto",

                  "& .MuiMenuItem-root": {
                    color: "#fff",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },

                  "& .MuiMenuItem-root:hover": {
                    backgroundColor: "#303047",
                  },

                  "& .MuiMenuItem-root.Mui-selected": {
                    backgroundColor: "#7c4dff",
                    color: "#fff",
                  },
                },
              },
            }}
            sx={{
              borderRadius: 2,
              "& .MuiSelect-select": {
                color: "#fff",
              },
            }}
          >
            {users?.map((user) => (
              <MenuItem key={user.user_id} value={user.user_id}>
                {user.user_name}
              </MenuItem>
            ))}
          </Select>

          <FormHelperText>{errors.user_id?.message}</FormHelperText>
        </FormControl>

        <TextField
          label="Purpose"
          variant="outlined"
          fullWidth
          {...register("purpose")}
          error={!!errors.purpose}
          helperText={errors.purpose?.message}
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

              "&.Mui-error fieldset": {
                borderColor: "#ff6b6b",
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
          label="Date"
          type="date"
          fullWidth
          inputProps={{
            min: todayStr,
          }}
          slotProps={{
            inputLabel: { shrink: true },
          }}
          {...register("date")}
          error={!!errors.date}
          helperText={errors.date?.message}
          sx={{
            mb: 2,

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

            "& input": { color: "#fff" },
          }}
        />

        <Box display="flex" gap={2} mb={2}>
          <TextField
            label="Start Time"
            type="time"
            fullWidth
            {...register("start_time")}
            slotProps={{ inputLabel: { shrink: true } }}
            error={!!errors.start_time || isPastTime || isInvalidTimeRange}
            helperText={
              // hasSubmitted &&
              errors.start_time?.message ||
              (isPastTime
                ? "Cannot select past time"
                : isInvalidTimeRange
                  ? "Start time must be before end time"
                  : "")
            }
            sx={{
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

                "&.Mui-error fieldset": {
                  borderColor: "#ff6b6b",
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

              "& input": { color: "#fff" },
            }}
          />

          <TextField
            label="End Time"
            type="time"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            {...register("end_time")}
            error={!!errors.end_time || isInvalidTimeRange}
            helperText={
              // hasSubmitted &&
              errors.end_time?.message ||
              (isInvalidTimeRange ? "End time must be after start time" : "")
            }
            sx={{
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

                "&.Mui-error fieldset": {
                  borderColor: "#ff6b6b",
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
          fullWidth
          {...register("required_capacity", { valueAsNumber: true })}
          error={!!errors.required_capacity || capacityExceeded}
          helperText={
            errors.required_capacity?.message ||
            (capacityExceeded
              ? `Room ${room_name} cannot accomodate more than ${room_capacity} people`
              : "")
          }
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

              "&.Mui-error fieldset": {
                borderColor: "#ff6b6b",
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

        <Button
          type="submit"
          // disabled={!isFormValid || isLoading}
          disabled={isLoading}
          sx={{
            background: "linear-gradient(55deg, #7e4fff, #ad7eff)",
            color: "#fff",
            borderRadius: 2,
            textTransform: "none",

            "&:hover": {
              background: "linear-gradient(55deg, #7340ff, #a674fd)",
            },

            "&.Mui-disabled": {
              background: "#444",
              color: "#aaa",
            },
          }}
        >
          {isLoading ? "Booking..." : "Confirm Booking"}
        </Button>
      </form>

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

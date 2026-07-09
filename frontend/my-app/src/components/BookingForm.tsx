"use client";

import { useState } from "react";
import { Box } from "@mui/material";

import DarkTextField from "@/components/common/DarkTextField";
import PrimaryButton from "@/components/common/PrimaryButton";
import AppSnackbar from "@/components/common/AppSnackbar";

import { useCreateBookingMutation, useGetBookingsQuery } from "../redux/api";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

import { datePickerFieldSx } from "@/utils/datePickerFieldSx";

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
    control,
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

  const currentUserId = Number(localStorage.getItem("user_id"));

  const currentUserName = localStorage.getItem("user_name") || "";

  const { data: bookings } = useGetBookingsQuery();

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
        user_id: currentUserId,
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

  //const todayStr = new Date().toISOString().split("T")[0];

  return (
    <Box mt={2}>
      <form onSubmit={handleFormSubmit(handleSubmit)} noValidate>
        <DarkTextField
          label="User"
          fullWidth
          disabled
          value={currentUserName}
          sx={{
            "& .Mui-disabled": {
              WebkitTextFillColor: "#ccc",
              color: "#ccc",
              opacity: 1,
            },
          }}
        />

        <DarkTextField
          required
          label="Purpose"
          variant="outlined"
          fullWidth
          {...register("purpose")}
          error={!!errors.purpose}
          helperText={errors.purpose?.message}
        />

        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="Date"
              value={field.value ? dayjs(field.value) : null}
              onChange={(value) =>
                field.onChange(value ? value.format("YYYY-MM-DD") : "")
              }
              disablePast
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  error: !!errors.date,
                  helperText: errors.date?.message,
                  sx: datePickerFieldSx,
                },
              }}
            />
          )}
        />

        <Box display="flex" gap={2}>
          <Controller
            name="start_time"
            control={control}
            render={({ field }) => (
              <TimePicker
                label="Start Time"
                value={field.value ? dayjs(`2026-01-01T${field.value}`) : null}
                onChange={(value) => {
                  field.onChange(value ? value.format("HH:mm") : "");
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error:
                      !!errors.start_time || isPastTime || isInvalidTimeRange,
                    helperText:
                      errors.start_time?.message ||
                      (isPastTime
                        ? "Cannot select past time"
                        : isInvalidTimeRange
                          ? "Start time must be before end time"
                          : ""),
                    sx: datePickerFieldSx,
                  },
                }}
              />
            )}
          />

          <Controller
            name="end_time"
            control={control}
            render={({ field }) => (
              <TimePicker
                label="End Time"
                value={field.value ? dayjs(`2026-01-01T${field.value}`) : null}
                onChange={(value) => {
                  field.onChange(value ? value.format("HH:mm") : "");
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !!errors.end_time || isInvalidTimeRange,
                    helperText:
                      errors.end_time?.message ||
                      (isInvalidTimeRange
                        ? "End time must be after start time"
                        : ""),
                    sx: datePickerFieldSx,
                  },
                }}
              />
            )}
          />
        </Box>

        <DarkTextField
          required
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
        />

        <PrimaryButton
          type="submit"
          // disabled={!isFormValid || isLoading}
          disabled={isLoading}
        >
          {isLoading ? "Booking..." : "Confirm Booking"}
        </PrimaryButton>
      </form>

      <AppSnackbar
        open={openSnackbar}
        message={snackbarMsg}
        severity={severity}
        onClose={() => setOpenSnackbar(false)}
      />
    </Box>
  );
}

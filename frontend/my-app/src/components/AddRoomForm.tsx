"use client";

import { Box, CircularProgress } from "@mui/material";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useState } from "react";
import { useAddRoomMutation } from "../redux/api";

import AppSnackbar from "@/components/common/AppSnackbar";
import DarkTextField from "@/components/common/DarkTextField";
import PrimaryButton from "@/components/common/PrimaryButton";
import SecondaryButton from "./common/SecondaryButton";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function AddRoomForm({ onClose }: { onClose: () => void }) {
  const roomSchema = z.object({
    room_name: z.string().trim().min(1, "Room name is required"),

    capacity: z.coerce
      .number({
        invalid_type_error: "Capacity is required",
      })
      .min(1, "Capacity must be greater than 0"),

    location: z.string().trim().min(1, "Location is required"),
  });

  type RoomFormData = z.infer<typeof roomSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
  });

  const [addRoom, { isLoading }] = useAddRoomMutation();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [msg, setMsg] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");

  const onSubmit = async (data: RoomFormData) => {
    try {
      await addRoom({
        room_name: data.room_name,
        capacity: data.capacity,
        location: data.location,
      }).unwrap();

      setMsg("Room added successfully");
      setSeverity("success");
      setOpenSnackbar(true);

      setTimeout(onClose, 1000);
    } catch (err) {
      const error = err as FetchBaseQueryError;

      let message = "Failed to add room";

      if ("data" in error) {
        const errData = error.data as { detail?: string };
        message = errData?.detail || message;
      }

      setMsg(message);
      setSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box mt={1}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DarkTextField
          label="Room Name"
          fullWidth
          {...register("room_name")}
          error={!!errors.room_name}
          helperText={errors.room_name?.message}
        />

        <DarkTextField
          label="Capacity"
          fullWidth
          {...register("capacity")}
          error={!!errors.capacity}
          helperText={errors.capacity?.message}
          inputProps={{ min: 1 }}
        />

        <DarkTextField
          label="Location"
          fullWidth
          {...register("location")}
          error={!!errors.location}
          helperText={errors.location?.message}
        />

        <Box display="flex" gap={2} mt={1}>
          <PrimaryButton
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{ mb: 2 }}
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Adding...
              </>
            ) : (
              "Add Room"
            )}
          </PrimaryButton>

          <SecondaryButton onClick={onClose} sx={{ mb: 2 }}>
            Cancel
          </SecondaryButton>
        </Box>
      </form>

      <AppSnackbar
        open={openSnackbar}
        message={msg}
        severity={severity}
        onClose={() => setOpenSnackbar(false)}
      />
    </Box>
  );
}

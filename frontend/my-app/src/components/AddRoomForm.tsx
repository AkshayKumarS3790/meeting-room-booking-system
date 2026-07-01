"use client";

import { useState } from "react";
import { TextField, Button, Box, Snackbar, Alert } from "@mui/material";
import { useAddRoomMutation } from "../redux/api";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
    <Box mt={2}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          label="Room Name"
          fullWidth
          {...register("room_name")}
          error={!!errors.room_name}
          helperText={errors.room_name?.message}
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
                borderColor: "#ff8a80",
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
          label="Capacity"
          fullWidth
          {...register("capacity")}
          error={!!errors.capacity}
          helperText={errors.capacity?.message}
          inputProps={{ min: 1 }}
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
                borderColor: "#ff8a80",
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
          label="Location"
          fullWidth
          {...register("location")}
          error={!!errors.location}
          helperText={errors.location?.message}
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
                borderColor: "#ff8a80",
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

        <Box display="flex" gap={2} mt={1}>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{
              mb: 2,
              borderRadius: 2,
              textTransform: "none",
              background: "linear-gradient(55deg, #7e4fff, #ad7eff)",
              color: "#fff",

              "&:hover": {
                background: "linear-gradient(55deg, #7340ff, #a674fd)",
              },
            }}
          >
            {isLoading ? "Adding..." : "Add Room"}
          </Button>

          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              mb: 2,
              borderRadius: 2,
              textTransform: "none",

              border: "1px solid #d1b3ff !important",
              color: "#d1b3ff !important",

              "&:hover": {
                borderColor: "#b388ff !important",
                color: "#b388ff !important",
                backgroundColor: "rgba(179,136,255,0.1)",
              },
            }}
          >
            Cancel
          </Button>
        </Box>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          severity={severity}
          variant="filled"
          sx={{ borderRadius: 2, fontWeight: "medium" }}
        >
          {msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

"use client";

import {
  Box,
  Card,
  CardContent,
  Chip,
  Tooltip,
  Typography,
} from "@mui/material";

import DangerButton from "./DangerButton";
import PrimaryButton from "./PrimaryButton";

import { Booking } from "@/redux/api";

type Props = {
  booking: Booking;
  onEdit: () => void;
  onDelete: () => void;
  canModify?: boolean;
  isMyBooking?: boolean;
};

export default function BookingCard({
  booking,
  onEdit,
  onDelete,
  canModify = true,
  isMyBooking = false,
}: Props) {
  return (
    <Card
      sx={{
        background: "linear-gradient(180deg, #303050, #1c1c32)",
        border: "1px solid rgba(255,255,255,.06)",
        color: "#fff",
        borderRadius: 3,
        transition: "0.3s",

        "&:hover": {
          transform: "translateY(-6px)",
          borderColor: "rgba(124,77,255,.25)",
          boxShadow: "0 0 25px rgba(124,77,255,.15)",
        },
      }}
    >
      <CardContent
        sx={{
          p: 2,
          mb: -0.5,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontSize: "1.35rem", fontWeight: "bold" }}>
            <b> {booking.room_name} </b>
          </Typography>

          {isMyBooking && (
            <Chip
              label="My Booking"
              size="small"
              sx={{
                background: "linear-gradient(90deg, #7c4dff, #a674fd)",
                color: "#fff",
                fontWeight: 600,
              }}
            />
          )}
        </Box>

        <Typography sx={{ color: "#bbb" }}>
          Booked By:
          <Box
            component="span"
            sx={{
              color: "#fff",
              fontWeight: 600,
              ml: 0.5,
            }}
          >
            {booking.booked_by}
          </Box>
        </Typography>

        <Typography sx={{ color: "#bbb" }}>
          Purpose:
          <Box
            component="span"
            sx={{
              color: "#fff",
              fontWeight: 600,
              ml: 0.5,
            }}
          >
            {booking.purpose}
          </Box>
        </Typography>

        <Typography sx={{ color: "#bbb" }}>
          Time:
          <Box
            component="span"
            sx={{
              color: "#fff",
              fontWeight: 600,
              ml: 0.5,
            }}
          >
            {booking.start_date_time} → {booking.end_date_time}
          </Box>
        </Typography>

        <Typography sx={{ color: "#bbb" }}>
          Capacity:
          <Box
            component="span"
            sx={{
              color: "#fff",
              fontWeight: 600,
              ml: 0.5,
            }}
          >
            {booking.required_capacity}
          </Box>
        </Typography>

        <Box display="flex" gap={2}>
          <Tooltip
            title={!canModify ? "You can only modify your own bookings" : ""}
            arrow
          >
            <span>
              <PrimaryButton
                sx={{
                  mt: 2,

                  "&.Mui-disabled": {
                    background: "#6f42c1",
                    color: "#d8c7ff",
                    opacity: 0.6,
                  },
                }}
                onClick={onEdit}
                disabled={!canModify}
              >
                Edit Booking
              </PrimaryButton>
            </span>
          </Tooltip>

          <Tooltip
            title={!canModify ? "You can only delete your own bookings" : ""}
            arrow
          >
            <span>
              <DangerButton
                sx={{
                  mt: 2,

                  "&.Mui-disabled": {
                    borderColor: "#ff6b6b",
                    color: "#ff8a8a",
                    opacity: 0.6,
                  },
                }}
                onClick={onDelete}
                disabled={!canModify}
              >
                Delete
              </DangerButton>
            </span>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
}

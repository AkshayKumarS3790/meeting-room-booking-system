"use client";

import { Card, CardContent, Typography, Box, Tooltip } from "@mui/material";

import PrimaryButton from "./PrimaryButton";
import DangerButton from "./DangerButton";

import { Booking } from "@/redux/api";

type Props = {
  booking: Booking;
  onEdit: () => void;
  onDelete: () => void;
  canModify?: boolean;
};

export default function BookingCard({
  booking,
  onEdit,
  onDelete,
  canModify = true,
}: Props) {
  return (
    <Card
      sx={{
        backgroundColor: "#2e2e45",
        color: "#fff",
        borderRadius: 3,
        transition: "0.3s",

        "&:hover": {
          backgroundColor: "#26263a",
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardContent
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography mb={0.5}>
          <b>Room:</b> {booking.room_name}
        </Typography>
        <Typography mb={0.5}>
          <b>Booked By:</b> {booking.booked_by}
        </Typography>
        <Typography mb={0.5}>
          <b>Purpose:</b> {booking.purpose}
        </Typography>
        <Typography mb={0.5}>
          <b>Time:</b> {booking.start_date_time} → {booking.end_date_time}
        </Typography>
        <Typography>
          <b>Capacity:</b> {booking.required_capacity}
        </Typography>

        <Box display="flex" gap={2}>
          <Tooltip
            title={!canModify ? "You can only modify your own bookings" : ""}
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
            title={!canModify ? "You can only modify your own bookings" : ""}
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

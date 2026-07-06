"use client";

import { Card, CardContent, Typography, Box } from "@mui/material";

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
        <Typography>
          <b>Room:</b> {booking.room_name}
        </Typography>

        <Typography>
          <b>Booked By:</b> {booking.booked_by}
        </Typography>

        <Typography>
          <b>Purpose:</b> {booking.purpose}
        </Typography>

        <Typography>
          <b>Time:</b> {booking.start_date_time} → {booking.end_date_time}
        </Typography>

        <Typography>
          <b>Capacity:</b> {booking.required_capacity}
        </Typography>

        {canModify && (
          <Box display="flex" gap={2}>
            <PrimaryButton sx={{ mt: 2 }} onClick={onEdit}>
              Edit Booking
            </PrimaryButton>

            <DangerButton sx={{ mt: 2 }} onClick={onDelete}>
              Delete
            </DangerButton>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

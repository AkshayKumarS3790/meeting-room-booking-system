"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import BookingForm from "./BookingForm";
import EditRoomForm from "./EditRoomForm";
import { Booking } from "@/services/api";

export type Room = {
  room_name: string;
  capacity: number;
  location: string;
};

export default function RoomCard({
  room,
  bookings,
  onAction,
}: {
  room: Room;
  bookings: Booking[] | undefined;
  onAction: (msg: string, type: "success" | "error") => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const now = new Date();

  const bookingCount = Array.isArray(bookings)
    ? bookings.filter((b) => {
        if (b.room_name !== room.room_name) return false;

        const endTime = new Date(b.end_date_time);
        return endTime > now;
      }).length
    : 0;

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(+5px)",
        },
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 0.2, p: 2, pb: 0.5 }}
      >
        <Typography sx={{ mb: 0 }} variant="h6" fontWeight="bold">
          {room.room_name}
        </Typography>

        <Box display="flex" alignItems="center" gap={0.5} sx={{ mr: 0.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: bookingCount > 0 ? "green" : "red",
            }}
          />

          <Typography variant="caption" fontWeight="medium">
            {bookingCount > 0
              ? `${bookingCount} booking${bookingCount > 1 ? "s" : ""}`
              : "No bookings"}
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ pt: 1 }}>
        <Typography>Capacity: {room.capacity}</Typography>
        <Typography>Location: {room.location}</Typography>

        <Button
          variant="contained"
          sx={{
            mt: 2,
            borderRadius: 2,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#1b5690",
            },
          }}
          onClick={() => setShowForm(!showForm)}
        >
          Book Room
        </Button>

        <Button
          variant="outlined"
          sx={{
            mt: 2,
            ml: 2,
            borderRadius: 2,
            textTransform: "none",
          }}
          onClick={() => setOpenEdit(true)}
        >
          Edit Room
        </Button>

        <Dialog open={showForm} onClose={() => setShowForm(false)} fullWidth>
          <DialogTitle>Book {room.room_name}</DialogTitle>
          <DialogContent>
            <BookingForm
              room_name={room.room_name}
              room_capacity={room.capacity}
              onSuccess={() => setShowForm(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
          <DialogTitle>Edit Room</DialogTitle>

          <DialogContent>
            <EditRoomForm
              room={room}
              onClose={() => setOpenEdit(false)}
              onSuccess={onAction}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

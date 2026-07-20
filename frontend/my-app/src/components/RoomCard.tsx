"use client";

import { useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import BookingForm from "./BookingForm";
import EditRoomForm from "./EditRoomForm";
import { Booking } from "@/redux/api";

import PrimaryButton from "@/components/common/PrimaryButton";
import SecondaryButton from "./common/SecondaryButton";
import AppDialog from "@/components/common/AppDialog";

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
        maxWidth: "100%",
        background: "linear-gradient(180deg, #303050, #1c1c32)",
        border: "1px solid rgba(255,255,255,.06)",
        color: "#fff",
        borderRadius: 3,
        transition: "0.3s",

        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",

        "&:hover": {
          transform: "translateY(-6px)",
          borderColor: "rgba(124,77,255,.25)",
          boxShadow: "0 0 25px rgba(124,77,255,.15)",
        },
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 0.2, p: 2, pb: 0.5 }}
      >
        <Typography
          sx={{
            mb: 0,
            fontWeight: 700,
            fontSize: "1.2rem",
            letterSpacing: "-0.3px",
          }}
        >
          {room.room_name}
        </Typography>

        <Box display="flex" alignItems="center" gap={0.5} sx={{ mr: 0.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: bookingCount > 0 ? "#24cd3e" : "#f23737",
            }}
          />

          <Typography variant="caption" fontWeight="medium">
            {bookingCount > 0
              ? `${bookingCount} booking${bookingCount > 1 ? "s" : ""}`
              : "No bookings"}
          </Typography>
        </Box>
      </Box>

      <CardContent
        sx={{
          pt: 1,
        }}
      >
        <Typography sx={{ color: "#ccc" }}>
          Capacity:{" "}
          <Box
            component="span"
            sx={{
              color: "#fff",
              fontWeight: 600,
            }}
          >
            {room.capacity}
          </Box>
        </Typography>

        <Typography sx={{ color: "#ccc" }}>
          Location:{" "}
          <Box
            component="span"
            sx={{
              color: "#fff",
              fontWeight: 600,
            }}
          >
            {room.location}
          </Box>
        </Typography>

        <PrimaryButton
          sx={{
            mt: 2,
            padding: "6px 14px",
          }}
          onClick={() => setShowForm(true)}
        >
          Book Room
        </PrimaryButton>

        <SecondaryButton
          sx={{
            mt: 2,
            ml: 2,
          }}
          onClick={() => setOpenEdit(true)}
        >
          Edit Room
        </SecondaryButton>

        <AppDialog
          open={showForm}
          onClose={() => setShowForm(false)}
          title={`Book ${room.room_name}`}
          fullWidth
        >
          <BookingForm
            room_name={room.room_name}
            room_capacity={room.capacity}
            onSuccess={() => setShowForm(false)}
          />
        </AppDialog>

        <AppDialog
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          title="Edit Room"
        >
          <EditRoomForm
            room={room}
            onClose={() => setOpenEdit(false)}
            onSuccess={onAction}
          />
        </AppDialog>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import BookingForm from "./BookingForm";
import EditRoomForm from "./EditRoomForm";

// import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";

export type Room = {
  room_name: string;
  capacity: number;
  location: string;
};

export default function RoomCard({
  room,
  onAction,
}: {
  room: Room;
  onAction: (msg: string, type: "success" | "error") => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

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
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {room.room_name}
        </Typography>

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

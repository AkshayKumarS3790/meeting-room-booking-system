"use client";

import {
  Container,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { useGetRoomsQuery } from "@/services/api";
import RoomCard from "@/components/RoomCard";
import BookingList from "@/components/BookingList";
import AddRoomForm from "@/components/AddRoomForm";
import { useState } from "react";

export default function Home() {
  const { data, error, isLoading } = useGetRoomsQuery(undefined, {});
  const [openRoomDialog, setOpenRoomDialog] = useState(false);
  const sortedRooms = Array.isArray(data)
    ? [...data].sort((a, b) =>
        a.room_name.localeCompare(b.room_name, undefined, {
          numeric: true,
          sensitivity: "base",
        }),
      )
    : [];

  if (isLoading) return <Typography>Loading rooms...</Typography>;
  if (error) return <Typography>Error loading rooms</Typography>;
  if (data && !Array.isArray(data)) {
    return <Typography>{data.message}</Typography>;
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        mb: 5,
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
      >
        Meeting Room Booking System
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" fontWeight="bold">
          Rooms
        </Typography>

        <Dialog open={openRoomDialog} onClose={() => setOpenRoomDialog(false)}>
          <DialogTitle>Add Room</DialogTitle>

          <DialogContent>
            <AddRoomForm onClose={() => setOpenRoomDialog(false)} />
          </DialogContent>
        </Dialog>

        <Button
          variant="contained"
          sx={{
            borderRadius: 2,
            textTransform: "none",
          }}
          onClick={() => setOpenRoomDialog(true)}
        >
          Add Room
        </Button>
      </Box>

      {data && data.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr", // mobile
              sm: "1fr 1fr", // tablet
              md: "1fr 1fr 1fr", // desktop
            },
            gap: 3,
            alignItems: "start",
          }}
        >
          {sortedRooms.map((room) => (
            <RoomCard key={room.room_name} room={room} />
          ))}
        </Box>
      ) : (
        <Typography>No rooms available</Typography>
      )}

      <Box mt={5}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Bookings
        </Typography>

        <BookingList />
      </Box>
    </Container>
  );
}

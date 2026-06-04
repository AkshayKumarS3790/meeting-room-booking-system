"use client";

import {
  Container,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert,
} from "@mui/material";
import { useGetRoomsQuery, useGetBookingsQuery } from "@/services/api";
import RoomCard from "@/components/RoomCard";
import BookingList from "@/components/BookingList";
import AddRoomForm from "@/components/AddRoomForm";
import { useState } from "react";

export default function Home() {
  const { data, error, isLoading } = useGetRoomsQuery(undefined, {});
  const { data: bookings } = useGetBookingsQuery();
  const [openRoomDialog, setOpenRoomDialog] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");

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
            <RoomCard
              key={room.room_name}
              room={room}
              bookings={bookings}
              onAction={(message: string, type: "success" | "error") => {
                setSnackbarMsg(message);
                setSeverity(type);
                setSnackbarOpen(true);
              }}
            />
          ))}
        </Box>
      ) : (
        <Typography>No rooms available</Typography>
      )}

      <Box mt={5}>
        <BookingList />
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity={severity} variant="filled">
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
}

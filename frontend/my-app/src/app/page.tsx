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
  TextField,
} from "@mui/material";
import { useGetRoomsQuery, useGetBookingsQuery } from "@/services/api";
import RoomCard from "@/components/RoomCard";
import BookingList from "@/components/BookingList";
import AddRoomForm from "@/components/AddRoomForm";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

export default function Home() {
  const [roomSearch, setRoomSearch] = useState("");

  const [openRoomDialog, setOpenRoomDialog] = useState(false);

  const debouncedSearch = useDebounce(roomSearch, 500);

  const { data, error, isLoading } = useGetRoomsQuery({
    search: debouncedSearch || undefined,
  });

  const { data: bookings } = useGetBookingsQuery({});

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

  if (isLoading) return <Typography>Loading page...</Typography>;

  if (error) return <Typography>Error loading the page</Typography>;

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
        sx={{
          height: 2,
          backgroundColor: "#7c4dff",
          mb: 3,
        }}
      />

      <Box
        className="section-card"
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: "#1e1e2f",
          mb: 4,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            Rooms
          </Typography>

          <Box display="flex" gap={2} alignItems="center">
            <TextField
              placeholder="Search rooms"
              value={roomSearch}
              onChange={(e) => setRoomSearch(e.target.value)}
              size="small"
              sx={{
                width: 200,

                background: "linear-gradient(145deg, #2a2a3d, #24243a)",

                borderRadius: 3,

                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  color: "#fff",

                  "& fieldset": {
                    borderColor: "transparent",
                  },

                  "&:hover fieldset": {
                    borderColor: "#7c4dff",
                  },

                  "&.Mui-focused fieldset": {
                    borderColor: "#7c4dff",
                    boxShadow: "0 0 6px rgba(124,77,255,0.4)",
                  },
                },

                "& input::placeholder": {
                  color: "#bbb",
                  opacity: 1,
                },

                "& input": {
                  color: "#fff",
                  padding: "8px 12px",
                },
              }}
            />

            <Button
              sx={{
                minWidth: 100,
                background: "linear-gradient(55deg, #7340ff, #a674fd)",
                color: "#fff",
                borderRadius: 2,
                textTransform: "none",
              }}
              onClick={() => setOpenRoomDialog(true)}
            >
              Add Room
            </Button>

            <Dialog
              open={openRoomDialog}
              disableScrollLock
              onClose={() => setOpenRoomDialog(false)}
              PaperProps={{
                sx: {
                  backgroundColor: "#1e1e2f",
                  color: "#fff",
                  borderRadius: 3,
                  padding: 2,
                },
              }}
            >
              <DialogTitle fontWeight="bold">Add Room</DialogTitle>

              <DialogContent>
                <AddRoomForm onClose={() => setOpenRoomDialog(false)} />
              </DialogContent>
            </Dialog>
          </Box>
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
          <Typography sx={{ opacity: 0.7 }}>No rooms available</Typography>
        )}
      </Box>

      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: "#1e1e2f",
          mt: 4,
        }}
      >
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

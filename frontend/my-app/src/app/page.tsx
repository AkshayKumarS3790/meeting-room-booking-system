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
  CircularProgress,
  Pagination,
} from "@mui/material";
import { useGetRoomsQuery, useGetBookingsQuery } from "@/services/api";
import RoomCard from "@/components/RoomCard";
import BookingList from "@/components/BookingList";
import AddRoomForm from "@/components/AddRoomForm";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
// import RoomCardSkeleton from "@/components/RoomCardSkeleton";

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

  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setPage(1);
  }, [roomSearch]);

  const sortedRooms = Array.isArray(data)
    ? [...data].sort((a, b) =>
        a.room_name.localeCompare(b.room_name, undefined, {
          numeric: true,
          sensitivity: "base",
        }),
      )
    : [];

  const startIndex = (page - 1) * itemsPerPage;

  const paginatedRooms = sortedRooms.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress sx={{ color: "#7c4dff", mb: 2 }} />
        <Typography sx={{ color: "#aaa" }}>Loading page...</Typography>
      </Box>

      // <Container maxWidth="lg" sx={{ mt: 4 }}>
      //   <Box
      //     sx={{
      //       display: "grid",
      //       gridTemplateColumns: {
      //         xs: "1fr",
      //         sm: "1fr 1fr",
      //         md: "1fr 1fr 1fr",
      //       },
      //       gap: 3,
      //     }}
      //   >
      //     {[...Array(6)].map((_, i) => (
      //       <RoomCardSkeleton key={i} />
      //     ))}
      //   </Box>
      // </Container>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <Box
          sx={{
            p: 4,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ErrorOutlineIcon sx={{ color: "#ff6b6b", fontSize: 50, mb: 1 }} />

          <Typography sx={{ color: "#ff6b6b", fontWeight: "bold" }}>
            Error loading the page
          </Typography>
        </Box>
      </Box>
    );
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
          <Typography variant="h5" sx={{ fontWeight: "bold", mt: 1 }}>
            Rooms
          </Typography>

          <Box display="flex" gap={2} alignItems="center">
            <TextField
              placeholder="Search rooms"
              value={roomSearch}
              onChange={(e) => setRoomSearch(e.target.value)}
              size="small"
              sx={{
                width: 150,

                background: "rgba(84, 66, 134, 0.4)",

                borderRadius: 2,

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

        <Box display="flex" justifyContent="center" mt={2} mb={2}>
          <Pagination
            count={Math.ceil(sortedRooms.length / itemsPerPage)}
            page={page}
            onChange={(e, value) => {
              setPage(value);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#ccc",
                borderRadius: "15%",
                transition: "0.2s",
              },

              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "#995eff",
                color: "#fff",
                fontWeight: "bold",
              },

              "& .MuiPaginationItem-root.Mui-selected:hover": {
                backgroundColor: "#7340ff",
              },
            }}
          />
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

              minHeight: "400px",
            }}
          >
            {paginatedRooms.map((room) => (
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

"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField,
} from "@mui/material";

import {
  Booking,
  Room,
  useGetBookingsQuery,
  useDeleteBookingMutation,
  useGetRoomsQuery,
} from "../services/api";

import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

import EditBookingForm from "./EditBookingForm";

export default function BookingList() {
  const [search, setSearch] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("all");

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [msg, setMsg] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, error } = useGetBookingsQuery({
    search: debouncedSearch || undefined,
    room_name: selectedRoom !== "all" ? selectedRoom : undefined,
    only_active: false,
  });

  const { data: rooms } = useGetRoomsQuery({});

  const [deleteBooking, { isLoading: isDeleting }] = useDeleteBookingMutation();

  const bookings = Array.isArray(data) ? data : [];

  const sortedBookings = [...bookings].sort(
    (a, b) => b.booking_id - a.booking_id,
  );

  const validBookings = sortedBookings.filter((b) => {
    const end = new Date(b.end_date_time);
    return end > new Date();
  });

  if (isLoading) return <Typography>Loading bookings...</Typography>;

  if (error) return <Typography>Error loading bookings</Typography>;

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" fontWeight="bold">
          Bookings
        </Typography>

        <Box display="flex" gap={2} alignItems="center">
          <TextField
            placeholder="Search bookings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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

          <FormControl
            variant="outlined"
            sx={{
              minWidth: 100,
              "& .MuiOutlinedInput-root": {
                height: 40,
                display: "flex",
                alignItems: "center",

                color: "lightgray",
                borderRadius: 2,

                "& fieldset": {
                  borderColor: "#afafaf",
                },

                "&:hover fieldset": {
                  borderColor: "#afafaf",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "#afafaf",
                  borderWidth: 2,
                },
              },

              "& .MuiSelect-select": {
                paddingTop: "10px",
                paddingBottom: "10px",
              },

              "& .MuiSvgIcon-root": {
                color: "lightgray",
              },

              "& .MuiInputLabel-root": {
                color: "#afafaf",
              },
            }}
          >
            <InputLabel>Select Room</InputLabel>

            <Select
              value={selectedRoom}
              label="Select Room"
              onChange={(e) => setSelectedRoom(e.target.value)}
              MenuProps={{
                disableScrollLock: true,
              }}
            >
              <MenuItem value="all">All Rooms</MenuItem>

              {Array.from(new Set(validBookings.map((b) => b.room_name))).map(
                (roomName) => (
                  <MenuItem key={roomName} value={roomName}>
                    {roomName}
                  </MenuItem>
                ),
              )}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {validBookings.length === 0 ? (
        <Typography sx={{ opacity: 0.7, mt: 2 }}>No bookings yet</Typography>
      ) : (
        <Box
          mt={3}
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
            },
            gap: 3,
            alignItems: "start",
          }}
        >
          {validBookings.map((b) => (
            <Card
              key={b.booking_id}
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
                  <b>Room:</b> {b.room_name}
                </Typography>

                <Typography>
                  <b>Booked By:</b> {b.booked_by}
                </Typography>

                <Typography>
                  <b>Purpose:</b> {b.purpose}
                </Typography>

                <Typography>
                  <b>Time:</b> {b.start_date_time} → {b.end_date_time}
                </Typography>

                <Typography>
                  <b>Capacity:</b> {b.required_capacity}
                </Typography>

                <Box display="flex" gap={2}>
                  <Button
                    className="secondary-btn"
                    sx={{
                      mt: 2,
                      background: "linear-gradient(55deg, #7e4fff, #ad7eff)",
                      color: "#fff",
                      borderRadius: 2,
                      textTransform: "none",
                      padding: "6px 14px",

                      "&:hover": {
                        background: "linear-gradient(55deg, #7340ff, #a674fd)",
                      },
                    }}
                    onClick={() => {
                      setSelectedBooking(b);
                      setOpenEditDialog(true);
                    }}
                  >
                    Edit Booking
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    sx={{
                      mt: 2,
                      borderRadius: 2,
                      textTransform: "none",
                    }}
                    onClick={() => {
                      setSelectedId(b.booking_id);
                      setOpenDialog(true);
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        disableScrollLock
        PaperProps={{
          sx: {
            backgroundColor: "#1e1e2f",
            color: "#fff",
            borderRadius: 3,
            padding: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Delete Booking</DialogTitle>

        <DialogContent>
          <Typography>Are you sure you want to delete this booking?</Typography>
        </DialogContent>

        <DialogActions>
          <Button
            sx={{
              background: "linear-gradient(55deg, #7e4fff, #ad7eff)",
              color: "#fff",
              borderRadius: 2,
              textTransform: "none",
              padding: "6px 14px",

              "&:hover": {
                background: "linear-gradient(55deg, #7340ff, #a674fd)",
              },
            }}
            onClick={() => setOpenDialog(false)}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="outlined"
            disabled={isDeleting}
            sx={{ borderRadius: 2, textTransform: "none" }}
            onClick={async () => {
              try {
                if (selectedId) {
                  await deleteBooking(selectedId).unwrap();
                }

                setMsg("Booking deleted successfully");
                setSeverity("success");
                setOpenSnackbar(true);

                setTimeout(() => {
                  setOpenDialog(false);
                }, 1200);
              } catch {
                setMsg("Delete failed");
                setSeverity("error");
                setOpenSnackbar(true);
              }
            }}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        disableScrollLock
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#1e1e2f",
            color: "#fff",
            borderRadius: 3,
            padding: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Edit Booking</DialogTitle>

        <DialogContent>
          {selectedBooking && (
            <EditBookingForm
              booking={selectedBooking}
              onClose={() => setOpenEditDialog(false)}
              room_capacity={
                Array.isArray(rooms)
                  ? rooms.find(
                      (r: Room) => r.room_name === selectedBooking.room_name,
                    )?.capacity || 0
                  : 0
              }
            />
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={severity} variant="filled">
          {msg}
        </Alert>
      </Snackbar>
    </>
  );
}

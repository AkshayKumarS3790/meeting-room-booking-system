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
} from "@mui/material";

import {
  Booking,
  Room,
  useGetBookingsQuery,
  useDeleteBookingMutation,
  useGetRoomsQuery,
} from "../services/api";
import { useState } from "react";
import EditBookingForm from "./EditBookingForm";

export default function BookingList() {
  const { data, isLoading, error } = useGetBookingsQuery();
  const { data: rooms } = useGetRoomsQuery();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [deleteBooking, { isLoading: isDeleting }] = useDeleteBookingMutation();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [msg, setMsg] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [selectedRoom, setSelectedRoom] = useState("all");

  const bookings = Array.isArray(data) ? data : [];

  const sortedBookings = [...bookings].sort(
    (a, b) => b.booking_id - a.booking_id,
  );

  const now = new Date();
  const validBookings = sortedBookings.filter((b) => {
    const endTime = new Date(b.end_date_time);
    return endTime > now;
  });

  const filteredBookings =
    selectedRoom === "all"
      ? validBookings
      : validBookings.filter((b) => b.room_name === selectedRoom);

  if (isLoading) return <Typography>Loading bookings...</Typography>;

  if (error) return <Typography>Error loading bookings</Typography>;

  if (validBookings.length === 0)
    return <Typography>No bookings yet</Typography>;

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

        <FormControl
          variant="outlined"
          sx={{
            minWidth: 100,
            "& .MuiOutlinedInput-root": {
              color: "lightgray",
              borderRadius: 2,

              "& fieldset": {
                borderColor: "#c3c3c3",
              },

              "&:hover fieldset": {
                borderColor: "#c3c3c3",
              },

              "&.Mui-focused fieldset": {
                borderColor: "#c3c3c3",
                borderWidth: 2,
              },
            },

            "& .MuiSvgIcon-root": {
              color: "lightgray",
            },

            "& .MuiInputLabel-root": {
              color: "#c3c3c3",
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
        {filteredBookings.map((b) => (
          <Card
            key={b.booking_id}
            sx={{
              width: "100%",
              borderRadius: 2,
              boxShadow: 2,
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

              <Box display="flex" gap={1} mt={1}>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ mt: 2, borderRadius: 2, textTransform: "none" }}
                  onClick={() => {
                    setSelectedBooking(b);
                    setOpenEditDialog(true);
                  }}
                >
                  Edit Booking
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  sx={{
                    mt: 2,
                    borderRadius: 2,
                    alignSelf: "flex-start",
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Delete Booking</DialogTitle>

        <DialogContent>
          <Typography>Are you sure you want to delete this booking?</Typography>
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: "none" }}
            onClick={() => setOpenDialog(false)}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
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
        fullWidth
      >
        <DialogTitle>Edit Booking</DialogTitle>

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

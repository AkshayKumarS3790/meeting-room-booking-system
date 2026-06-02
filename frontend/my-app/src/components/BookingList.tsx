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
} from "@mui/material";

import { useGetBookingsQuery, useDeleteBookingMutation } from "../services/api";
import { useState } from "react";

export default function BookingList() {
  const { data, isLoading, error } = useGetBookingsQuery();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [deleteBooking, { isLoading: isDeleting }] = useDeleteBookingMutation();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [msg, setMsg] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");

  const bookings = Array.isArray(data) ? data : [];

  const sortedBookings = [...bookings].sort(
    (a, b) => b.booking_id - a.booking_id,
  );

  const now = new Date();
  const validBookings = sortedBookings.filter((b) => {
    const endTime = new Date(b.end_date_time);
    return endTime > now;
  });

  if (isLoading) return <Typography>Loading bookings...</Typography>;

  if (error) return <Typography>Error loading bookings</Typography>;

  if (validBookings.length === 0)
    return <Typography>No bookings yet</Typography>;

  return (
    <>
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

              <Button
                variant="outlined"
                color="error"
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  alignSelf: "flex-start",
                }}
                onClick={() => {
                  setSelectedId(b.booking_id);
                  setOpenDialog(true);
                }}
              >
                Delete Booking
              </Button>
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
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>

          <Button
            color="error"
            variant="contained"
            disabled={isDeleting}
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

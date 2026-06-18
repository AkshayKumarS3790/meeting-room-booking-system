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
  Pagination,
  CircularProgress,
  Skeleton,
} from "@mui/material";

import {
  Booking,
  Room,
  useGetBookingsQuery,
  useDeleteBookingMutation,
  useGetRoomsQuery,
} from "../services/api";

import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

import EditBookingForm from "./EditBookingForm";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function BookingList() {
  const [search, setSearch] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("all");

  const [selectedDate, setSelectedDate] = useState("");

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

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    setPage(1);
  }, [search, selectedRoom, selectedDate]);

  const sortedBookings = [...bookings].sort(
    (a, b) => b.booking_id - a.booking_id,
  );

  const filteredBookings = sortedBookings.filter((b) => {
    const now = new Date();
    const end = new Date(b.end_date_time);

    if (end <= now) return false;

    if (
      debouncedSearch &&
      !b.booked_by.toLowerCase().includes(debouncedSearch.toLowerCase())
    ) {
      return false;
    }

    if (selectedRoom !== "all" && b.room_name !== selectedRoom) {
      return false;
    }

    if (selectedDate) {
      const bookingDate = b.start_date_time.split(" ")[0];
      if (bookingDate !== selectedDate) return false;
    }

    return true;
  });

  const totalItems = filteredBookings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startItem = (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, totalItems);

  const startIndex = (page - 1) * itemsPerPage;

  const paginatedBookings = filteredBookings.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
          },
          gap: 3,
          minHeight: "500px",
        }}
      >
        {[...Array(6)].map((_, i) => (
          <BookingSkeleton key={i} />
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="60vh"
      >
        <ErrorOutlineIcon sx={{ color: "#ff6b6b", fontSize: 40, mb: 1 }} />
        <Typography sx={{ color: "#ff6b6b" }}>
          Error loading bookings
        </Typography>
      </Box>
    );
  }

  function BookingSkeleton() {
    return (
      <Card
        sx={{
          backgroundColor: "#2e2e45",
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="90%" />
          <Skeleton variant="text" width="50%" />

          <Box mt={2} display="flex" gap={2}>
            <Skeleton variant="rectangular" width={110} height={35} />
            <Skeleton variant="rectangular" width={110} height={35} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", mt: 1 }}>
          Bookings
        </Typography>

        <Box display="flex" gap={2} alignItems="center" sx={{ mb: 1 }}>
          <Box
            display="flex"
            gap={2}
            alignItems="center"
            flexWrap="wrap"
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 1fr 1fr auto",
              },
              alignItems: "center",
              width: "100%",
            }}
          >
            <TextField
              placeholder="Search User"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                width: 150,

                background: "rgba(84, 66, 134, 0.4)",

                borderRadius: 2,

                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
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

            <TextField
              type="date"
              size="small"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              sx={{
                width: 150,
                background: "rgba(84, 66, 134, 0.4)",
                borderRadius: 2,

                "& fieldset": {
                  borderColor: "#995eff",
                },

                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
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

                "& .MuiInputLabel-root": {
                  color: "#d4bbff",
                },

                "& input": {
                  color: "#bbb",
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
                  borderRadius: 2,

                  "& fieldset": {
                    borderColor: "#995eff",
                  },

                  "&:hover fieldset": {
                    borderColor: "#995eff",
                  },

                  "&.Mui-focused fieldset": {
                    borderColor: "#995eff",
                    borderWidth: 2,
                  },
                },

                "& .MuiInputLabel-root": {
                  color: "#d4bbff",
                },

                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#995eff",
                },

                "& .MuiSelect-select": {
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  color: "#e0ceff",
                },

                "& .MuiSelect-select.Mui-focused": {
                  color: "#e0ceff",
                },

                "& .MuiSvgIcon-root": {
                  color: "#995eff",
                },

                "& .Mui-focused .MuiSelect-select": {
                  color: "#e0ceff",
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

                  PaperProps: {
                    sx: {
                      backgroundColor: "#2e2e45",
                      color: "#fff",
                      borderRadius: 2,
                      height: 400,
                    },
                  },
                }}
                sx={{
                  color: "#a06afe",

                  "& .MuiSelect-select": {
                    color: "#e0ceff",
                  },

                  "& .MuiSvgIcon-root": {
                    color: "#a06afe",
                  },
                }}
              >
                <MenuItem value="all">All Rooms</MenuItem>

                {Array.isArray(rooms) &&
                  rooms.map((room: Room) => (
                    <MenuItem key={room.room_name} value={room.room_name}>
                      {room.room_name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              onClick={() => {
                setSearch("");
                setSelectedRoom("all");
                setSelectedDate("");
              }}
              sx={{
                height: "40px",
                borderRadius: 2,
                border: "1px solid #995eff",
                color: "#fff",
                textTransform: "none",
                background: "linear-gradient(55deg, #7e4fff, #ad7eff)",
                padding: "6px 14px",

                "&:hover": {
                  background: "linear-gradient(55deg, #7340ff, #a674fd)",
                },
              }}
            >
              Clear
            </Button>
          </Box>
        </Box>
      </Box>

      {filteredBookings.length === 0 ? (
        <Typography sx={{ opacity: 0.7, mt: 2 }}>No bookings yet</Typography>
      ) : (
        <Box
          mt={2}
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
            },
            gap: 3,
            alignItems: "start",

            minHeight: "500px",
          }}
        >
          {paginatedBookings.map((b) => (
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
                      borderColor: "#fc5d5d",
                      textTransform: "none",
                      color: "#fc5d5d",
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
            sx={{
              borderRadius: 2,
              color: "#fc5d5d",
              textTransform: "none",
              borderColor: "#fc5d5d",
            }}
            onClick={async () => {
              try {
                if (selectedId) {
                  await deleteBooking(selectedId).unwrap();
                }

                setOpenDialog(false);

                setMsg("Booking deleted successfully");
                setSeverity("success");
                setOpenSnackbar(true);

                setOpenDialog(false);
              } catch {
                setMsg("Delete failed");
                setSeverity("error");
                setOpenSnackbar(true);
              }
            }}
          >
            {isDeleting ? (
              <CircularProgress size={20} sx={{ color: "#fff" }} />
            ) : (
              "Delete"
            )}
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

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
        width="100%"
      >
        {/* Left side - Per page filtering part */}
        <Box display="flex" alignItems="center" gap={2}>
          <Typography sx={{ color: "#ccc", fontSize: 14 }}>Per page</Typography>

          <Select
            size="small"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setPage(1);
            }}
            sx={{
              color: "#fff",
              backgroundColor: "#2e2e45",
              borderRadius: 2,
            }}
          >
            {[3, 6, 9, 12, 15, 18].map((num) => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
          </Select>

          <Typography sx={{ color: "#ccc", fontSize: 14 }}>
            {totalItems === 0
              ? "0–0 of 0"
              : `${startItem}–${endItem} of ${totalItems}`}
          </Typography>
        </Box>

        {/* Right side - Pagination part */}
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => {
            setPage(value);
            window.scrollTo({ behavior: "smooth" });
          }}
          siblingCount={1}
          boundaryCount={1}
          sx={{
            "& .MuiPaginationItem-root": {
              color: "#ccc",
              borderRadius: "12%",
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

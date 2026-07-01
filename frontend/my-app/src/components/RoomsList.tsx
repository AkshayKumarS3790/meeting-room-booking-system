"use client";

import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert,
  TextField,
  CircularProgress,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";

import { useGetRoomsQuery, useGetBookingsQuery, Room } from "@/redux/api";

import RoomCard from "./RoomCard";
import AddRoomForm from "./AddRoomForm";

import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function RoomsList() {
  const [roomSearch, setRoomSearch] = useState("");
  const [capacitySearch, setCapacitySearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const [openRoomDialog, setOpenRoomDialog] = useState(false);

  const debouncedSearch = useDebounce(roomSearch, 500);

  const { data: bookingsData } = useGetBookingsQuery();
  const bookings = bookingsData || [];

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const { data: allRoomsData } = useGetRoomsQuery({});

  const { data, error, isLoading } = useGetRoomsQuery(
    {
      page,
      limit: itemsPerPage,
      search: debouncedSearch || undefined,
      required_capacity: capacitySearch ? Number(capacitySearch) : undefined,
      location: selectedLocation !== "all" ? selectedLocation : undefined,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const rooms = Array.isArray(data) ? data : [];
  const totalItems = rooms.length;

  const allRooms = Array.isArray(allRoomsData) ? allRoomsData : [];

  const uniqueLocations = Array.from(
    new Set(allRooms.map((room) => room.location)),
  );

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startItem = (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, totalItems);

  useEffect(() => {
    setPage(1);
  }, [roomSearch, selectedLocation]);

  const startIndex = (page - 1) * itemsPerPage;

  const paginatedRooms = rooms.slice(startIndex, startIndex + itemsPerPage);

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
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
        }}
      >
        {/* LEFT SIDE */}
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#fff" }}>
          Rooms
        </Typography>

        {/* RIGHT SIDE - FILTERS */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr 1fr auto",
            },
            gap: 2,
            alignItems: "center",
            justifyContent: "end",
            width: "auto",
          }}
        >
          <TextField
            placeholder="Search rooms"
            value={roomSearch}
            onChange={(e) => setRoomSearch(e.target.value)}
            size="small"
            sx={{
              width: "100%",
              maxWidth: 150,

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

          <TextField
            placeholder="Search capacity"
            value={capacitySearch}
            onChange={(e) => setCapacitySearch(e.target.value)}
            size="small"
            sx={{
              width: "100%",
              maxWidth: 150,

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

          <FormControl
            variant="outlined"
            sx={{
              minWidth: 150,
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
            <InputLabel>Select Location</InputLabel>

            <Select
              value={selectedLocation}
              label="Select Location"
              onChange={(e) => setSelectedLocation(e.target.value)}
              MenuProps={{
                disableScrollLock: true,

                PaperProps: {
                  sx: {
                    backgroundColor: "#2e2e45",
                    color: "#fff",
                    borderRadius: 2,
                  },
                },
              }}
              sx={{
                width: "100%",
                maxWidth: 150,

                color: "#a06afe",

                "& .MuiSelect-select": {
                  color: "#e0ceff",
                },

                "& .MuiSvgIcon-root": {
                  color: "#a06afe",
                },
              }}
            >
              <MenuItem value="all">All Locations</MenuItem>

              {uniqueLocations.map((loc) => (
                <MenuItem key={loc} value={loc}>
                  {loc}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            sx={{
              height: "40px",
              maxWidth: 150,
              width: "100%",
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

      {rooms.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr", //mobile
              sm: "1fr 1fr", //tablet
              md: "1fr 1fr 1fr", //desktop
            },
            gap: 3,
            alignItems: "start",
            minHeight: "400px",
          }}
        >
          {paginatedRooms.map((room: Room) => (
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

      {/* PAGINATION */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
        width="100%"
      >
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

          <Typography>
            {totalItems === 0
              ? "0-0 of 0"
              : `${startItem}–${endItem} of ${totalItems}`}
          </Typography>
        </Box>

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
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity={severity} variant="filled">
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </>
  );
}

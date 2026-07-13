"use client";

import { Box, Typography } from "@mui/material";

import { useState, useEffect } from "react";

import { useGetRoomsQuery, useGetBookingsQuery, Room } from "@/redux/api";

import AddRoomForm from "./AddRoomForm";
import RoomCard from "./RoomCard";

import AppDialog from "./common/AppDialog";
import AppSnackbar from "./common/AppSnackbar";
import PageError from "./common/PageError";
import PageLoader from "./common/PageLoader";
import PaginationFooter from "./common/PaginationFooter";
import RoomFilters from "./common/RoomFilters";

import { useDebounce } from "@/hooks/useDebounce";

export default function RoomsList() {
  const [roomSearch, setRoomSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const [openRoomDialog, setOpenRoomDialog] = useState(false);

  const debouncedSearch = useDebounce(roomSearch, 500);

  const searchValue = debouncedSearch.trim();

  const isCapacitySearch = searchValue !== "" && !isNaN(Number(searchValue));

  const { data: bookingsData } = useGetBookingsQuery({});
  const bookings = bookingsData || [];

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data: allRoomsData } = useGetRoomsQuery({});

  const { data, error, isLoading } = useGetRoomsQuery(
    {
      page,
      limit: itemsPerPage,
      search: !isCapacitySearch ? searchValue || undefined : undefined,

      required_capacity: isCapacitySearch ? Number(searchValue) : undefined,

      location: selectedLocation !== "all" ? selectedLocation : undefined,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const rooms = Array.isArray(data)
    ? [...data].sort((a, b) => a.room_name.localeCompare(b.room_name))
    : [];

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

  useEffect(() => {
    console.log("Page Changed: ", page);
    console.log("Items Per Page: ", itemsPerPage);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page, itemsPerPage]);

  const startIndex = (page - 1) * itemsPerPage;

  const paginatedRooms = rooms.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return <PageLoader message="Loading page..." />;
  }

  if (error) {
    return <PageError message="Error loading the page" />;
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

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
            flex: 1,
            display: "flex",
            justifyContent: "flex-end",
            ml: 2,
          }}
        >
          <RoomFilters
            roomSearch={roomSearch}
            setRoomSearch={setRoomSearch}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            locationOptions={[
              {
                value: "all",
                label: "All Locations",
              },

              ...uniqueLocations.map((loc) => ({
                value: loc,
                label: loc,
              })),
            ]}
            clearFilters={() => {
              setRoomSearch("");
              setSelectedLocation("all");
              setPage(1);
            }}
            onAddRoom={() => setOpenRoomDialog(true)}
          />
        </Box>
      </Box>

      {rooms.length > 0 ? (
        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
              xl: "repeat(5, 1fr)",
            },

            gap: 3,
            width: "100%",
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
      <PaginationFooter
        page={page}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        setPage={setPage}
        setItemsPerPage={setItemsPerPage}
        totalItems={totalItems}
        startItem={startItem}
        endItem={endItem}
        pageSizeOptions={[10, 15, 20, 25]}
      />

      <AppDialog
        open={openRoomDialog}
        onClose={() => setOpenRoomDialog(false)}
        title="Add Room"
      >
        <AddRoomForm onClose={() => setOpenRoomDialog(false)} />
      </AppDialog>

      <AppSnackbar
        open={snackbarOpen}
        message={snackbarMsg}
        severity={severity}
        onClose={() => setSnackbarOpen(false)}
      />
    </>
  );
}

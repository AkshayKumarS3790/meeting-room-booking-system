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
        <RoomFilters
          roomSearch={roomSearch}
          setRoomSearch={setRoomSearch}
          capacitySearch={capacitySearch}
          setCapacitySearch={setCapacitySearch}
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
          onAddRoom={() => setOpenRoomDialog(true)}
        />
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
      <PaginationFooter
        page={page}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        setPage={setPage}
        setItemsPerPage={setItemsPerPage}
        totalItems={totalItems}
        startItem={startItem}
        endItem={endItem}
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

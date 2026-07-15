"use client";

import { Box, Typography, Skeleton, Card, CardContent } from "@mui/material";

import {
  Booking,
  Room,
  useGetBookingsQuery,
  useDeleteBookingMutation,
  useGetRoomsQuery,
} from "../redux/api";

import { useState, useEffect } from "react";

import EditBookingForm from "./EditBookingForm";

import AppSnackbar from "./common/AppSnackbar";
import AppDialog from "./common/AppDialog";
import BookingCard from "./common/BookingCard";
import BookingFilters from "./common/BookingFilters";
import ConfirmDialog from "./common/ConfirmDialog";
import PageError from "./common/PageError";
import PaginationFooter from "./common/PaginationFooter";

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

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const { data, isLoading, error } = useGetBookingsQuery(
    {
      page,
      limit: itemsPerPage,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const bookings = data || [];

  const now = new Date();

  const currentUserId =
    typeof window !== "undefined"
      ? Number(localStorage.getItem("user_id") ?? 0)
      : 0;

  const activeBookings = bookings.filter((b: Booking) => {
    const end = new Date(b.end_date_time);

    // active check
    if (end <= now) return false;

    // search filter (VERY IMPORTANT)
    if (search) {
      const searchLower = search.toLowerCase();

      const matches =
        b.booked_by.toLowerCase().includes(searchLower) ||
        b.room_name.toLowerCase().includes(searchLower) ||
        b.purpose.toLowerCase().includes(searchLower);

      if (!matches) return false;
    }

    // room filter
    if (selectedRoom !== "all" && b.room_name !== selectedRoom) {
      return false;
    }

    // date filter
    if (selectedDate) {
      const bookingDate = b.start_date_time.split(" ")[0];
      if (bookingDate !== selectedDate) return false;
    }

    return true;
  });

  const sortedBookings = [...activeBookings].sort((a, b) => {
    const aIsMine = a.user_id === currentUserId;
    const bIsMine = b.user_id === currentUserId;

    if (aIsMine && !bIsMine) return -1;
    if (!aIsMine && bIsMine) return 1;

    return (
      new Date(a.start_date_time).getTime() -
      new Date(b.start_date_time).getTime()
    );
  });

  const totalItems = sortedBookings.length;

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startItem = (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, totalItems);

  const { data: rooms } = useGetRoomsQuery({});

  const [deleteBooking] = useDeleteBookingMutation();

  useEffect(() => {
    setPage(1);
  }, [search, selectedRoom, selectedDate]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page, itemsPerPage]);

  const startIndex = (page - 1) * itemsPerPage;

  const paginatedBookings = sortedBookings.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 3,
        }}
      >
        {[...Array(6)].map((_, i) => (
          <BookingSkeleton key={i} />
        ))}
      </Box>
    );
  }

  if (error) {
    return <PageError message="Error Loading bookings" />;
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
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            mt: 1,
            color: "#fff",
          }}
        >
          Bookings
        </Typography>

        <BookingFilters
          search={search}
          setSearch={setSearch}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
          roomOptions={[
            { value: "all", label: "All Rooms" },

            ...(Array.isArray(rooms)
              ? [...rooms]
                  .sort((a, b) => a.room_name.localeCompare(b.room_name))
                  .map((room) => ({
                    value: room.room_name,
                    label: room.room_name,
                  }))
              : []),
          ]}
          clearFilters={() => {
            setSearch("");
            setSelectedRoom("all");
            setSelectedDate("");
          }}
        />
      </Box>

      {activeBookings.length === 0 ? (
        <Typography sx={{ opacity: 0.7, mt: 2, color: "#fff" }}>
          {search.trim() !== "" || selectedDate !== "" || selectedRoom !== "all"
            ? "No bookings match the selected filters."
            : "No bookings available."}
        </Typography>
      ) : (
        <Box
          mt={2}
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: 3,
            alignItems: "start",
            justifyContent: "start",
          }}
        >
          {paginatedBookings.map((b: Booking) => (
            <BookingCard
              key={b.booking_id}
              booking={b}
              canModify={b.user_id === currentUserId}
              isMyBooking={b.user_id === currentUserId}
              onEdit={() => {
                setSelectedBooking(b);
                setOpenEditDialog(true);
              }}
              onDelete={() => {
                setSelectedId(b.booking_id);
                setOpenDialog(true);
              }}
            />
          ))}
        </Box>
      )}

      <ConfirmDialog
        open={openDialog}
        title="Delete Booking"
        message="Are you sure you want to delete this booking?"
        onClose={() => setOpenDialog(false)}
        onConfirm={async () => {
          try {
            if (selectedId) {
              await deleteBooking(selectedId).unwrap();
            }

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
      />

      <AppDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        title="Edit Booking"
        fullWidth
      >
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
      </AppDialog>

      <PaginationFooter
        page={page}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        setPage={setPage}
        setItemsPerPage={setItemsPerPage}
        totalItems={totalItems}
        startItem={startItem}
        endItem={endItem}
        pageSizeOptions={[6, 9, 12, 15]}
      />

      <AppSnackbar
        open={openSnackbar}
        message={msg}
        severity={severity}
        onClose={() => setOpenSnackbar(false)}
      />
    </>
  );
}

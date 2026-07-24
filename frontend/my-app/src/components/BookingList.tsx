"use client";

import { Box, Card, CardContent, Skeleton, Typography } from "@mui/material";

import {
  Booking,
  Room,
  useDeleteBookingMutation,
  useGetBookingsQuery,
  useGetRoomsQuery,
} from "../redux/api";

import { useEffect, useState } from "react";

import EditBookingForm from "./EditBookingForm";

import AppDialog from "./common/AppDialog";
import AppSnackbar from "./common/AppSnackbar";
import BookingCard from "./common/BookingCard";
import BookingFilters from "./common/BookingFilters";
import ConfirmDialog from "./common/ConfirmDialog";
import PageError from "./common/PageError";
import PaginationFooter from "./common/PaginationFooter";

import { getCurrentUser } from "@/utils/currentUser";

import { canDeleteAnyBooking, canEditAnyBooking } from "@/utils/permissions";

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

  const currentUser = getCurrentUser();

  const currentUserId = currentUser?.user_id ?? 0;

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

  const [deleteBooking, { isLoading: isDeletingBooking }] =
    useDeleteBookingMutation();

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

  function BookingSkeleton() {
    return (
      <Card
        sx={{
          background: "linear-gradient(180deg, #303050, #1c1c32)",

          border: "1px solid rgba(255,255,255,.06)",
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Skeleton variant="text" width="40%" height={40} />
            <Skeleton variant="rounded" width={90} height={30} />
          </Box>

          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="65%" />
          <Skeleton variant="text" width="90%" />
          <Skeleton variant="text" width="50%" />

          <Box mt={3} display="flex" gap={2}>
            <Skeleton variant="rounded" width={120} height={45} />
            <Skeleton variant="rounded" width={95} height={45} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return <PageError message="Error Loading bookings" />;
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box>
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 700,

              fontSize: {
                xs: "1.4rem",
                md: "2rem",
              },
            }}
          >
            Booking Management
          </Typography>

          <Typography
            sx={{
              color: "#888",
              fontSize: {
                xs: "0.7rem",
                md: "0.95rem",
              },
            }}
          >
            Manage upcoming meetings and room reservations.
          </Typography>
        </Box>

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

      {isLoading ? (
        <Box
          mt={2}
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(3, minmax(0, 1fr))",
            },
            gap: 3,
            justifyContent: "start",
          }}
        >
          {[...Array(6)].map((_, i) => (
            <BookingSkeleton key={i} />
          ))}
        </Box>
      ) : activeBookings.length === 0 ? (
        <Box
          sx={{
            py: 8,
            textAlign: "center",
            borderRadius: 4,
            background: "linear-gradient(180deg,#24243e,#1a1a2e)",
            border: "1px solid rgba(255,255,255,.06)",
          }}
        >
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.3rem",
            }}
          >
            No Bookings Found
          </Typography>

          <Typography
            sx={{
              mt: 1,

              color: "#888",
            }}
          >
            {search.trim() !== "" ||
            selectedDate !== "" ||
            selectedRoom !== "all"
              ? "Try changing your filters."
              : "No active bookings available."}
          </Typography>
        </Box>
      ) : (
        <Box
          mt={2}
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(3, minmax(0, 1fr))",
            },

            gap: 3,
            alignItems: "start",
            justifyContent: "start",
          }}
        >
          {paginatedBookings.map((b: Booking) => (
            <BookingCard
              key={b.booking_id}
              booking={b}
              canModify={
                b.user_id === currentUserId ||
                canEditAnyBooking() ||
                canDeleteAnyBooking()
              }
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
        confirmText="Delete"
        loadingText="Delete..."
        onClose={() => setOpenDialog(false)}
        isLoading={isDeletingBooking}
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
        totalPages={isLoading ? 1 : totalPages}
        itemsPerPage={itemsPerPage}
        setPage={setPage}
        setItemsPerPage={setItemsPerPage}
        totalItems={isLoading ? 0 : totalItems}
        startItem={isLoading ? 0 : startItem}
        endItem={isLoading ? 0 : endItem}
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

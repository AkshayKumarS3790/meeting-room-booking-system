// Calendar page.tsx file

"use client";

import { useState } from "react";
import { Calendar, dateFnsLocalizer, Views, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { Box, Typography, Skeleton } from "@mui/material";
import { useGetBookingsQuery } from "@/redux/api";

import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>(Views.MONTH);

  const { data: bookingsData, isLoading, error } = useGetBookingsQuery({});

  if (error) {
    return <div style={{ color: "red" }}>Error loading calendar</div>;
  }

  const generateColor = (name: string) => {
    const colors = [
      "#8b5cf6",
      "#06b6d4",
      "#22c55e",
      "#f59e0b",
      "#ec4899",
      "#3b82f6",
      "#14b8a6",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash += name.charCodeAt(i);
    }

    return colors[hash % colors.length];
  };

  const bookings =
    bookingsData && Array.isArray(bookingsData) ? bookingsData : [];

  // FILTER: remove expired bookings
  const filteredBookings = bookings.filter((b) => {
    const end = new Date(b.end_date_time.replace(" ", "T"));
    return new Date() <= end; // keeps active + upcoming
  });

  // CREATE EVENTS
  const events = filteredBookings.map((b) => ({
    title: b.room_name,
    start: new Date(b.start_date_time.replace(" ", "T")),
    end: new Date(b.end_date_time.replace(" ", "T")),
    resource: {
      room: b.room_name,
      bookedBy: b.booked_by,
      purpose: b.purpose,
    },
  }));

  type CalendarEvent = {
    title: string;
    start: Date;
    end: Date;
    resource: {
      room: string;
      bookedBy: string;
      purpose: string;
    };
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    console.log(event);
    const color = generateColor(event.resource.room);

    return {
      style: {
        backgroundColor: color + "90",
        border: `1px solid ${color}`,
        color: "#d9d9d9",
        borderRadius: "6px",
      },
    };
  };

  function CalendarSkeleton() {
    return (
      <Box
        sx={{
          height: "77vh",
          backgroundColor: "#1e1e2f",
          borderRadius: 3,
          p: 2,
        }}
      >
        {/* Toolbar */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box display="flex" gap={1}>
            <Skeleton variant="rounded" width={70} height={36} />
            <Skeleton variant="rounded" width={70} height={36} />
            <Skeleton variant="rounded" width={70} height={36} />
          </Box>

          <Skeleton variant="text" width={180} height={40} />

          <Box display="flex" gap={1}>
            <Skeleton variant="rounded" width={70} height={36} />
            <Skeleton variant="rounded" width={70} height={36} />
            <Skeleton variant="rounded" width={70} height={36} />
          </Box>
        </Box>

        {/* Calendar Body */}
        <Skeleton
          variant="rounded"
          width="100%"
          height="90%"
          sx={{
            bgcolor: "rgba(255,255,255,0.08)",
          }}
        />
      </Box>
    );
  }

  function EventComponent({ event }: { event: CalendarEvent }) {
    return (
      <Box
        sx={{
          overflow: "hidden",
        }}
      >
        <Typography fontSize={12} fontWeight={600} noWrap>
          {event.title}
        </Typography>

        <Typography fontSize={9} color="#eee" noWrap>
          {event.resource.bookedBy}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", mb: 1, color: "#fff" }}
      >
        Calendar
      </Typography>

      {isLoading ? (
        <CalendarSkeleton />
      ) : (
        <Box
          className={`calendar-view-${view}`}
          sx={{
            height: "77vh",
            backgroundColor: "#1e1e2f",
            borderRadius: 3,
            p: 2,
          }}
        >
          <Calendar<CalendarEvent>
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            date={date}
            view={view}
            onNavigate={(newDate) => setDate(newDate)}
            onView={(newView) => setView(newView)}
            eventPropGetter={eventStyleGetter}
            style={{ height: "100%", color: "#fff" }}
            components={{
              event: EventComponent,
            }}
            views={[Views.MONTH, Views.WEEK, Views.DAY]}
            toolbar={true}
            scrollToTime={
              new Date(new Date().setHours(new Date().getHours() - 1, 45, 0, 0))
            }
          />
        </Box>
      )}
    </Box>
  );
}

// Calendar page.tsx file

"use client";

import { useState } from "react";
import { Calendar, dateFnsLocalizer, Views, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { Box, Typography } from "@mui/material";
import { useGetBookingsQuery } from "@/services/api";

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

  const {
    data: bookingsData,
    isLoading,
    error,
  } = useGetBookingsQuery({
    only_active: false,
  });

  if (isLoading) {
    return <div style={{ color: "white" }}>Loading calendar...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error loading calendar</div>;
  }

  const generateColor = (name: string) => {
    const colors = ["#7c4dff", "#00bcd4", "#4caf50", "#ff9800", "#e91e63"];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash += name.charCodeAt(i);
    }

    return colors[hash % colors.length];
  };

  const bookings = bookingsData || [];

  const events = bookings.map((b) => ({
    title: `${b.room_name} (${b.booked_by})`,
    start: new Date(b.start_date_time),
    end: new Date(b.end_date_time),
    resource: b.room_name,
  }));

  type CalendarEvent = {
    title: string;
    start: Date;
    end: Date;
    resource: string;
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    console.log(event);
    const color = generateColor(event.resource || "default");

    return {
      style: {
        backgroundColor: color + "40",
        border: `1.5px solid ${color}`,
        color: "#d9d9d9",
        borderRadius: "6px",
      },
    };
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Calendar
      </Typography>

      <Box
        sx={{
          height: "75vh",
          backgroundColor: "#2e2e45",
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
        />
      </Box>
    </Box>
  );
}

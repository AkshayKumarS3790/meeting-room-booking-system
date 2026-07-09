"use client";

import { Container, Typography, Box, Grid } from "@mui/material";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import EventIcon from "@mui/icons-material/Event";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useGetRoomsQuery, useGetBookingsQuery } from "@/redux/api";
import { useEffect } from "react";

export default function Home() {
  const { data: roomsData } = useGetRoomsQuery({});
  const { data: bookingsData } = useGetBookingsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const rooms = Array.isArray(roomsData) ? roomsData : [];
  const bookings =
    bookingsData && Array.isArray(bookingsData) ? bookingsData : [];

  const totalRooms = rooms.length;
  const totalBookings = bookings.length;
  const now = new Date();

  const activeBookings = bookings.filter((b) => {
    // const start = new Date(b.start_date_time.replace(" ", "T"));
    const end = new Date(b.end_date_time.replace(" ", "T"));

    return now <= end;
  }).length;

  console.log(bookings);

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg">
        {/* HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box textAlign="center" mb={6}>
            {/* GLOW EFFECT */}
            <Typography
              variant="h3"
              sx={{
                pt: 2,
                fontWeight: 700,
                color: "#fff",
                textShadow: "0 0 20px rgba(124, 77, 255, 0.6)", // background glow
                minHeight: "72px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TypeAnimation
                sequence={[
                  "MeetSpace",
                  3000,
                  "Smart Scheduling",
                  2500,
                  "Seamless Booking",
                  2500,
                  "MeetSpace",
                  3000,
                ]}
                speed={50}
                repeat={1}
                cursor={false}
              />
            </Typography>

            <Typography sx={{ color: "#aaa", mt: 2, fontSize: 18 }}>
              Smart meeting room booking system to manage rooms, schedules and
              availability effortlessly
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={3} mb={5}>
          {[
            { label: "Rooms Available", value: totalRooms },
            { label: "Bookings Made", value: totalBookings },
            { label: "Active Bookings", value: activeBookings },
          ].map((item, i) => (
            <Grid size={{ xs: 12, sm: 4 }} key={i}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: "#1e1e2f",
                  textAlign: "center",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Typography fontSize={28} fontWeight={700}>
                  {item.value}
                </Typography>

                <Typography sx={{ color: "#aaa" }}>{item.label}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* FEATURES SECTION */}
        <Box
          sx={{
            pl: 2,
            pr: 2,
            borderRadius: 3,
            background: "#1e1e2f",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#fff", pt: 2, pb: 2 }}
          >
            Features
          </Typography>
          <Grid container spacing={4} mb={6}>
            {[
              {
                icon: <MeetingRoomIcon sx={{ fontSize: 40, color: "#fff" }} />,
                title: "Room Management",
                desc: "Add, update and manage meeting rooms seamlessly",
              },
              {
                icon: <EventIcon sx={{ fontSize: 40, color: "#fff" }} />,
                title: "Easy Booking",
                desc: "Create and manage bookings with conflict prevention",
              },
              {
                icon: (
                  <CalendarMonthIcon sx={{ fontSize: 40, color: "#fff" }} />
                ),
                title: "Smart Calendar",
                desc: "Visualize schedules and avoid overlapping bookings",
              },
            ].map((item, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Box
                    sx={{
                      background: "#2e2e45",
                      p: 3,
                      mb: 3,
                      borderRadius: 3,
                      textAlign: "center",
                      transition: "0.3s",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "scale(1.05)",
                        background: "#282846",
                      },
                    }}
                  >
                    {item.icon}
                    <Typography mt={1} fontWeight={600}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ color: "#aaa", fontSize: 13 }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* BENEFITS SECTION */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Box
            sx={{
              background: "#1e1e2f",
              borderRadius: 3,
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography fontWeight={600} mb={2} sx={{ color: "#fff" }}>
              Why MeetSpace?
            </Typography>

            <Typography sx={{ color: "#aaa", maxWidth: 600, margin: "0 auto" }}>
              MeetSpace simplifies room booking by providing an intuitive
              interface, real-time availability tracking, and seamless
              scheduling — helping teams collaborate more efficiently and avoid
              conflicts.
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}

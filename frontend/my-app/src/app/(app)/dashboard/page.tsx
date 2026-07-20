"use client";

import { Container, Typography, Box, Grid, Skeleton } from "@mui/material";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import EventIcon from "@mui/icons-material/Event";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useGetRoomsQuery, useGetBookingsQuery } from "@/redux/api";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: roomsData, isLoading: roomsLoading } = useGetRoomsQuery({});

  const { data: bookingsData, isLoading: bookingsLoading } =
    useGetBookingsQuery(
      { page: 1, limit: 1000 },
      {
        refetchOnMountOrArgChange: true,
      },
    );

  const isLoading = roomsLoading || bookingsLoading;
  const [userName, setUserName] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    const storedUserName = localStorage.getItem("user_name");

    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const rooms = Array.isArray(roomsData) ? roomsData : [];
  const bookings =
    bookingsData && Array.isArray(bookingsData) ? bookingsData : [];

  const totalRooms = rooms.length;
  const totalBookings = bookings.length;
  const now = new Date();

  const activeBookings = bookings.filter((b) => {
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
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{ duration: 0.6 }}
        >
          <Box textAlign="center" mb={6}>
            {/* GLOW EFFECT */}
            <Typography
              variant="h3"
              sx={{
                pt: 2,
                fontWeight: 900,
                color: "#fff",

                letterSpacing: "-2px",

                textShadow: "0 0 30px rgba(124,77,255,.35)",

                minHeight: {
                  xs: "90px",
                  md: "120px",
                },

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                fontSize: {
                  xs: "2rem",
                  sm: "3rem",
                  md: "4rem",
                },
              }}
            >
              {isLoading ? (
                <Skeleton
                  variant="text"
                  width={320}
                  height={80}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.08)",
                  }}
                />
              ) : (
                <TypeAnimation
                  sequence={[`Welcome ${userName}`]}
                  speed={40}
                  cursor={false}
                />
              )}
            </Typography>

            <Typography
              sx={{
                mt: 1,
                maxWidth: 750,
                mx: "auto",
                color: "#9ca3af",
                lineHeight: 1.5,

                fontSize: {
                  xs: "1rem",
                  md: "1.1rem",
                },
              }}
            >
              {isLoading ? (
                <Skeleton
                  variant="text"
                  width="70%"
                  sx={{
                    mx: "auto",
                    bgcolor: "rgba(255,255,255,0.08)",
                  }}
                />
              ) : (
                "Smart meeting room booking system to manage rooms, schedules and availability effortlessly"
              )}
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
                  borderRadius: 4,
                  background: "linear-gradient(180deg,#24243e,#1a1a2e)",
                  border: "1px solid rgba(255,255,255,.06)",
                  textAlign: "center",
                  transition: "all .3s ease",

                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 0 25px rgba(124,77,255,.15)",
                    borderColor: "rgba(124,77,255,.25)",
                  },
                }}
              >
                {isLoading ? (
                  <Skeleton
                    variant="text"
                    width={80}
                    height={50}
                    sx={{
                      mx: "auto",
                      bgcolor: "rgba(255,255,255,0.08)",
                    }}
                  />
                ) : (
                  <>
                    <Typography
                      sx={{
                        fontSize: "2rem",
                        fontWeight: 800,
                        color: "#fff",
                      }}
                    >
                      {item.value}
                    </Typography>
                  </>
                )}

                {isLoading ? (
                  <Skeleton
                    variant="text"
                    width={120}
                    sx={{
                      mx: "auto",
                      bgcolor: "rgba(255,255,255,0.08)",
                    }}
                  />
                ) : (
                  <Typography sx={{ color: "#aaa" }}>{item.label}</Typography>
                )}
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
            {isLoading ? (
              <Skeleton
                variant="text"
                width={140}
                sx={{
                  mx: "auto",
                  bgcolor: "rgba(255,255,255,0.08)",
                }}
              />
            ) : (
              "Everything you need"
            )}
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
                      background: "linear-gradient(180deg, #24243e, #1a1a2e)",
                      border: "1px solid rgba(255,255,255,.06)",
                      p: 3,
                      mb: 3,
                      borderRadius: 3,
                      textAlign: "center",
                      transition: "0.3s",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 0 25px rgba(124,77,255,.15)",
                        borderColor: "rgba(124,77,255,.25)",
                      },
                    }}
                  >
                    {isLoading ? (
                      <Skeleton
                        variant="circular"
                        width={40}
                        height={40}
                        sx={{
                          mx: "auto",
                          bgcolor: "rgba(255,255,255,0.08)",
                        }}
                      />
                    ) : (
                      item.icon
                    )}

                    {isLoading ? (
                      <Skeleton
                        variant="text"
                        width="60%"
                        sx={{
                          mx: "auto",
                          bgcolor: "rgba(255,255,255,0.08)",
                        }}
                      />
                    ) : (
                      <Typography mt={1} fontWeight={600}>
                        {item.title}
                      </Typography>
                    )}

                    {isLoading ? (
                      <>
                        <Skeleton
                          variant="text"
                          sx={{
                            bgcolor: "rgba(255,255,255,0.08)",
                          }}
                        />
                        <Skeleton
                          variant="text"
                          width="80%"
                          sx={{
                            mx: "auto",
                            bgcolor: "rgba(255,255,255,0.08)",
                          }}
                        />
                      </>
                    ) : (
                      <Typography sx={{ color: "#aaa", fontSize: 13 }}>
                        {item.desc}
                      </Typography>
                    )}
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
              background: "linear-gradient(180deg,#24243e,#1a1a2e)",
              border: "1px solid rgba(255,255,255,.06)",
              borderRadius: 3,
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#fff",
                pb: 2,
              }}
            >
              {isLoading ? (
                <Skeleton
                  variant="text"
                  width={180}
                  sx={{
                    mx: "auto",
                    bgcolor: "rgba(255,255,255,0.08)",
                  }}
                />
              ) : (
                "Why Teams Choose MeetSpace"
              )}
            </Typography>

            <Typography
              sx={{
                color: "#aaa",
                maxWidth: 750,
                margin: "0 auto",
              }}
            >
              {isLoading ? (
                <>
                  <Skeleton
                    variant="text"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.08)",
                    }}
                  />
                  <Skeleton
                    variant="text"
                    width="80%"
                    sx={{
                      mx: "auto",
                      bgcolor: "rgba(255,255,255,0.08)",
                    }}
                  />
                </>
              ) : (
                "MeetSpace simplifies room booking by providing an intuitive interface, real-time availability tracking, and seamless scheduling - helping teams collaborate more efficiently and avoid conflicts."
              )}
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}

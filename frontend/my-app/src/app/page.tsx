"use client";

import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import FloatingOrbs from "@/components/ui/FloatingOrbs";
import ParticlesBackground from "@/components/ui/ParticlesBackground";

export default function LandingPage() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#12121c",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <ParticlesBackground />
      <FloatingOrbs />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* NAVBAR */}
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,

            zIndex: 1000,
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(255,255,255,.06)",
            bgcolor: "rgba(18,18,28,.75)",
          }}
        >
          <Container maxWidth="xl">
            <Box
              sx={{
                minHeight: 65,
                py: {
                  xs: 1,
                  md: 0,
                },

                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: {
                  xs: "wrap",
                  md: "nowrap",
                },

                gap: 1,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  background: "linear-gradient(90deg,#7c4dff,#a674fd,#d0bcff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: {
                    xs: "1.3rem",
                    md: "1.6rem",
                  },
                }}
              >
                MeetSpace
              </Typography>

              <Box display="flex" gap={2}>
                <Button
                  onClick={() => router.push("/login")}
                  sx={{
                    color: "#fff",
                    textTransform: "none",
                    fontSize: {
                      xs: ".85rem",
                      md: "1rem",
                    },
                  }}
                >
                  Login
                </Button>

                <Button
                  variant="contained"
                  onClick={() => router.push("/register")}
                  sx={{
                    textTransform: "none",
                    borderRadius: "999px",
                    fontSize: {
                      xs: ".85rem",
                      md: "1rem",
                    },
                    px: {
                      xs: 1.5,
                      md: 3,
                    },
                    background: "linear-gradient(90deg,#7c4dff,#a674fd)",
                    "&:hover": {
                      background: "linear-gradient(90deg,#7340ff,#9865ff)",
                    },
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>

        <Box
          sx={{
            pt: "70px",
          }}
        >
          {/* HERO */}
          <Container maxWidth="lg">
            <motion.div
              initial={{
                opacity: 0,
                y: 50,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
              }}
            >
              <Box
                sx={{
                  minHeight: {
                    xs: "auto",
                    md: "88vh",
                  },
                  py: {
                    xs: 8,
                    md: 0,
                  },

                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",

                  justifyContent: {
                    xs: "flex-start",
                    md: "center",
                  },

                  textAlign: "center",
                }}
              >
                {/* Title */}
                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: 900,
                    lineHeight: 1,
                    letterSpacing: "-2px",
                    maxWidth: 1000,
                    fontSize: {
                      xs: "2.4rem",
                      sm: "3.2rem",
                      md: "5.5rem",
                    },
                    textShadow: "0 0 40px rgba(124,77,255,.15)",
                  }}
                >
                  Stop Fighting For
                  <br />
                  <Box
                    component="span"
                    sx={{
                      background:
                        "linear-gradient(90deg,#7c4dff,#a674fd,#d0bcff)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Meeting Rooms!
                  </Box>
                </Typography>

                {/* Subtitle */}
                <Typography
                  sx={{
                    mt: 4,
                    maxWidth: 900,
                    color: "#9ca3af",
                    lineHeight: 1.8,
                    fontSize: {
                      xs: "1rem",
                      md: "1.2rem",
                    },
                  }}
                >
                  MeetSpace helps teams book meeting rooms, manage availability,
                  and eliminate scheduling conflicts before they happen.
                </Typography>

                {/* Buttons */}
                <Box
                  sx={{
                    mt: 5,
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => router.push("/login")}
                    sx={{
                      textTransform: "none",
                      borderRadius: "999px",
                      px: {
                        xs: 3,
                        md: 5,
                      },
                      py: {
                        xs: 1.1,
                        md: 1.4,
                      },
                      fontWeight: 700,
                      background: "linear-gradient(90deg,#7c4dff,#a674fd)",
                      boxShadow: "0 0 35px rgba(124,77,255,.45)",

                      "&:hover": {
                        background: "linear-gradient(90deg,#7340ff,#9865ff)",
                      },
                    }}
                  >
                    Get Started
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => router.push("/register")}
                    sx={{
                      textTransform: "none",
                      borderRadius: "999px",
                      px: 5,
                      py: 1.4,
                      color: "#fff",
                      borderColor: "#7c4dff",

                      "&:hover": {
                        borderColor: "#a674fd",
                        background: "rgba(124,77,255,.08)",
                      },
                    }}
                  >
                    Create Account
                  </Button>
                </Box>

                {/* Stats */}
                <Box
                  sx={{
                    mt: 6,

                    display: "flex",

                    justifyContent: "center",

                    alignItems: "flex-start",

                    flexWrap: "wrap",

                    gap: {
                      xs: 4,
                      md: 8,
                    },
                  }}
                >
                  {[
                    {
                      number: "100%",
                      label: "Conflict Prevention",
                    },
                    {
                      number: "24/7",
                      label: "Availability Tracking",
                    },
                    {
                      number: "1 Click",
                      label: "Booking Experience",
                    },
                  ].map((item) => (
                    <Box
                      key={item.label}
                      sx={{
                        minWidth: {
                          xs: 90,
                          md: 180,
                        },

                        textAlign: "center",
                      }}
                    >
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 20,
                        }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                        }}
                        viewport={{
                          once: true,
                        }}
                        transition={{
                          duration: 0.5,
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 800,
                            color: "#fff",

                            fontSize: {
                              xs: "1.3rem",
                              sm: "1.7rem",
                              md: "2.5rem",
                            },

                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.number}
                        </Typography>

                        <Typography
                          sx={{
                            color: "#888",

                            fontSize: {
                              xs: ".75rem",
                              sm: ".9rem",
                              md: "1rem",
                            },
                          }}
                        >
                          {item.label}
                        </Typography>
                      </motion.div>
                    </Box>
                  ))}
                </Box>
              </Box>
            </motion.div>
          </Container>

          {/* PROBLEM SECTION */}
          <Box
            sx={{
              py: 8,
              mt: 4,

              background:
                "linear-gradient(180deg, rgba(30,30,47,.45), rgba(18,18,28,.2))",

              borderTop: "1px solid rgba(255,255,255,.05)",
              borderBottom: "1px solid rgba(255,255,255,.05)",
            }}
          >
            <Container maxWidth="lg">
              <Typography
                textAlign="center"
                sx={{
                  color: "#fff",
                  fontSize: {
                    xs: "2rem",
                    sm: "2.25rem",
                    md: "2.5rem",
                  },
                  fontWeight: 700,
                  mb: 5,
                }}
              >
                Why Teams Choose MeetSpace
              </Typography>

              <Grid container spacing={3}>
                {[
                  {
                    icon: "🚫",
                    title: "No Double Bookings",
                    desc: "Prevent overlapping reservations with smart conflict detection.",
                  },
                  {
                    icon: "⚡",
                    title: "Instant Availability",
                    desc: "See room availability in real time.",
                  },
                  {
                    icon: "📅",
                    title: "Effortless Scheduling",
                    desc: "Book rooms in seconds and stay organized.",
                  },
                ].map((item) => (
                  <Grid size={{ xs: 12, md: 4 }} key={item.title}>
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 40,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                        amount: 0.2,
                      }}
                      transition={{
                        duration: 0.6,
                      }}
                      whileHover={{
                        scale: 1.04,
                        y: -5,
                      }}
                    >
                      <Box
                        sx={{
                          p: 4,
                          borderRadius: 4,
                          background: "rgba(30,30,47,.8)",
                          border: "1px solid rgba(255,255,255,.06)",
                          minHeight: 158,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-start",
                          transition: "all .3s ease",

                          "&:hover": {
                            boxShadow: "0 0 30px rgba(124,77,255,.15)",
                            borderColor: "rgba(124,77,255,.25)",
                          },
                        }}
                      >
                        <Typography
                          fontSize="1.5rem"
                          sx={{
                            color: "#fff",
                            fontWeight: 700,
                            mb: 1,
                            textAlign: "center",
                          }}
                        >
                          {item.icon} {item.title}
                        </Typography>

                        <Typography color="#aaa" sx={{ textAlign: "center" }}>
                          {item.desc}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>

          {/* HOW IT WORKS */}
          <Box
            sx={{
              py: 8,
            }}
          >
            <Container maxWidth="lg">
              <Typography
                textAlign="center"
                sx={{
                  color: "#fff",
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  mb: 5,
                }}
              >
                How It Works
              </Typography>

              <Grid container spacing={3}>
                {["Login", "Choose Room", "Select Time", "Book Instantly"].map(
                  (step, index) => (
                    <Grid
                      key={step}
                      size={{ xs: 12, md: 3 }}
                      sx={{
                        position: "relative",
                      }}
                    >
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 50,
                        }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                        }}
                        viewport={{
                          once: true,
                          amount: 0.3,
                        }}
                        transition={{
                          delay: index * 0.15,
                          duration: 0.5,
                        }}
                        whileHover={{
                          y: -8,
                        }}
                      >
                        <Box
                          sx={{
                            p: {
                              xs: 2,
                              md: 4,
                            },
                            textAlign: "center",
                            borderRadius: 4,
                            background:
                              "linear-gradient(180deg, rgba(38,38,60,.95), rgba(22,22,35,.95))",

                            border: "1px solid rgba(255,255,255,.06)",
                            backdropFilter: "blur(12px)",
                            boxShadow: "0 10px 25px rgba(0,0,0,.25)",

                            transition: "all .3s ease",

                            "&:hover": {
                              boxShadow: "0 0 30px rgba(124,77,255,.18)",
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "3rem",
                              color: "#7c4dff",
                              fontWeight: 800,
                            }}
                          >
                            {index + 1}
                          </Typography>

                          <Typography
                            sx={{
                              mt: 1,
                              color: "#fff",
                              fontWeight: 600,
                            }}
                          >
                            {step}
                          </Typography>
                        </Box>
                        {index < 3 && (
                          <Box
                            sx={{
                              display: {
                                xs: "none",
                                md: "flex",
                              },

                              position: "absolute",

                              right: -28,

                              top: "50%",

                              transform: "translateY(-50%)",

                              zIndex: 2,

                              color: "#7c4dff",
                            }}
                          >
                            <ArrowForwardIcon sx={{ fontSize: 32 }} />
                          </Box>
                        )}
                      </motion.div>
                    </Grid>
                  ),
                )}
              </Grid>
            </Container>
          </Box>

          {/* CTA */}
          <Box
            sx={{
              py: 12,

              background:
                "linear-gradient(180deg, rgba(124,77,255,.08), rgba(18,18,28,.2))",

              borderTop: "1px solid rgba(255,255,255,.05)",
            }}
          >
            <Container
              maxWidth="md"
              sx={{
                textAlign: "center",
              }}
            >
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.95,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.6,
                }}
              >
                <Typography
                  sx={{
                    color: "#fff",
                    fontSize: {
                      xs: "1.9rem",
                      sm: "2.3rem",
                      md: "3rem",
                    },
                    fontWeight: 800,
                  }}
                >
                  Your Next Meeting Starts Here.
                </Typography>

                <Typography
                  sx={{
                    color: "#aaa",
                    mt: 2,
                    mb: 4,
                  }}
                >
                  Create your workspace and start booking rooms in minutes.
                </Typography>

                <Button
                  onClick={() => router.push("/register")}
                  variant="contained"
                  size="large"
                  sx={{
                    textTransform: "none",
                    px: 4,
                    py: 1.5,
                    borderRadius: "999px",
                    background: "linear-gradient(90deg,#7c4dff,#a674fd)",
                    boxShadow: "0 0 30px rgba(124,77,255,.4)",
                  }}
                >
                  Create Account
                </Button>
              </motion.div>
            </Container>
          </Box>

          {/* FOOTER */}
          <Box
            sx={{
              borderTop: "1px solid rgba(255,255,255,.06)",
              py: 3,
              textAlign: "center",
              color: "#777",
            }}
          >
            © 2026 MeetSpace. All rights reserved.
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

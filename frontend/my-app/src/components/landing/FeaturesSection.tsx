"use client";

import { Box, Container, Grid, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function FeaturesSection() {
  const features = [
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
  ];

  return (
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
            fontWeight: 700,
            mb: 5,

            fontSize: {
              xs: "2rem",
              sm: "2.25rem",
              md: "2.5rem",
            },
          }}
        >
          Why Teams Choose MeetSpace
        </Typography>

        <Grid container spacing={3}>
          {features.map((item) => (
            <Grid size={{ xs: 12, md: 4 }} key={item.title}>
              <motion.div
                initial={{
                  opacity: 0,
                  y: 60,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.35,
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
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

                    transition: "all .3s ease",

                    "&:hover": {
                      boxShadow: "0 0 30px rgba(124,77,255,.15)",
                      borderColor: "rgba(124,77,255,.25)",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color: "#fff",
                      fontWeight: 700,
                      mb: 1,
                      textAlign: "center",
                      fontSize: "1.5rem",
                    }}
                  >
                    {item.icon} {item.title}
                  </Typography>

                  <Typography
                    color="#aaa"
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {item.desc}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

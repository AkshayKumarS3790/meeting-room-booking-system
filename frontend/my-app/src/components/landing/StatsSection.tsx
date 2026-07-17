"use client";

import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function StatsSection() {
  const stats = [
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
  ];

  return (
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
      {stats.map((item) => (
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

                whiteSpace: "nowrap",

                fontSize: {
                  xs: "1.3rem",
                  sm: "1.7rem",
                  md: "2.5rem",
                },
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
  );
}

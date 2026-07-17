"use client";

import { Box, Container, Grid, Typography } from "@mui/material";
import { motion } from "framer-motion";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function WorkflowSection() {
  const steps = ["Login", "Choose Room", "Select Time", "Book Instantly"];

  return (
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
          {steps.map((step, index) => (
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
                  y: 70,
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
                  duration: 0.7,
                  delay: index * 0.18,
                  ease: "easeOut",
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

                      color: "#7c4dff",
                    }}
                  >
                    <ArrowForwardIcon sx={{ fontSize: 32 }} />
                  </Box>
                )}
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

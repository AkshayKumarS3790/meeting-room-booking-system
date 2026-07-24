"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";

import { TypeAnimation } from "react-type-animation";
import StatsSection from "./StatsSection";

type HeroSectionProps = {
  onLogin: () => void;
  onRegister: () => void;
};

export default function HeroSection({ onLogin, onRegister }: HeroSectionProps) {
  return (
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
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-2px",
              maxWidth: 1000,
              textShadow: "0 0 40px rgba(124,77,255,.15)",

              fontSize: {
                xs: "2.4rem",
                sm: "3.2rem",
                md: "5.5rem",
              },
            }}
          >
            Stop Fighting For
            <br />
            <Box
              component="span"
              sx={{
                background: "linear-gradient(90deg, #7c4dff, #a674fd, #d0bcff)",

                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Meeting Rooms!
            </Box>
          </Typography>

          <Box
            sx={{
              mt: 3,
              height: {
                xs: 50,
                md: 60,
              },

              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontWeight: 800,

                fontSize: {
                  xs: "1.6rem",
                  md: "2rem",
                },

                letterSpacing: "-0.2px",
                background: "linear-gradient(90deg,#7c4dff,#a674fd,#d0bcff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 25px rgba(124,77,255,.45)",
              }}
            >
              <TypeAnimation
                sequence={[
                  "MeetSpace",
                  2000,

                  "Smart Scheduling",
                  2000,

                  "Seamless Booking",
                  2000,
                ]}
                speed={40}
                repeat={2}
                cursor={false}
              />
            </Typography>
          </Box>

          <Typography
            sx={{
              mt: 3,
              maxWidth: 900,
              color: "#9ca3af",
              lineHeight: 1.8,
              fontSize: {
                xs: "1rem",
                md: "1.2rem",
              },
            }}
          >
            MeetSpace helps teams book meeting rooms, manage availability, and
            eliminate scheduling conflicts before they happen.
          </Typography>

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
              onClick={onLogin}
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
              }}
            >
              Get Started
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={onRegister}
              sx={{
                textTransform: "none",
                borderRadius: "999px",
                px: 4,
                py: 1.4,
                color: "#fff",
                borderColor: "#7c4dff",
              }}
            >
              Create Account
            </Button>
          </Box>

          <StatsSection />
        </Box>
      </motion.div>
    </Container>
  );
}

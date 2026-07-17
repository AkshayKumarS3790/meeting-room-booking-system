"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function LandingNavbar() {
  const router = useRouter();

  return (
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
  );
}

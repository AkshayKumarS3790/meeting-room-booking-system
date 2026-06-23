// main app's page.tsx file

"use client";

import { Container, Typography, Box } from "@mui/material";

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box mb={2}>
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
        >
          Meeting Room Booking System
        </Typography>
      </Box>

      <Box
        sx={{
          height: 2,
          backgroundColor: "#7c4dff",
          mb: 3,
        }}
      />

      <Box>
        This is the home page of the Meeting Rooms Booking System application
      </Box>
    </Container>
  );
}

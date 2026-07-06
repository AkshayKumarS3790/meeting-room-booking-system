"use client";

import { Box, CircularProgress, Typography } from "@mui/material";

export default function PageLoader({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="80vh"
    >
      <CircularProgress
        sx={{
          color: "#7c4dff",
          mb: 2,
        }}
      />

      <Typography sx={{ color: "#aaa" }}>{message}</Typography>
    </Box>
  );
}

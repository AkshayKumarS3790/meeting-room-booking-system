"use client";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Box, Typography } from "@mui/material";

export default function PageError({
  message = "Something went wrong",
}: {
  message?: string;
}) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="80vh"
    >
      <Box
        sx={{
          p: 4,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ErrorOutlineIcon
          sx={{
            color: "#ff6b6b",
            fontSize: 50,
            mb: 1,
          }}
        />

        <Typography
          sx={{
            color: "#ff6b6b",
            fontWeight: "bold",
          }}
        >
          {message}
        </Typography>
      </Box>
    </Box>
  );
}

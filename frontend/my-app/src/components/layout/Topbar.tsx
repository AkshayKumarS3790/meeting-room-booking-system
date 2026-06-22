"use client";

import { Box, IconButton, useMediaQuery, Typography } from "@mui/material";

export default function Topbar({
  setMobileOpen,
}: {
  setMobileOpen: (val: boolean) => void;
}) {
  const isMobile = useMediaQuery("(max-width:900px)");

  return (
    <Box
      sx={{
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 4,
        backgroundColor: "#1e1e2f",
        borderBottom: "1px solid #2e2e45",
      }}
    >
      {/* LEFT */}
      {isMobile ? (
        <IconButton sx={{ color: "#fff" }} onClick={() => setMobileOpen(true)}>
          ☰
        </IconButton>
      ) : (
        <Typography fontWeight="bold">Dashboard</Typography>
      )}

      {/* RIGHT */}
      <Box display="flex" alignItems="center" gap={2}>
        <Typography>User</Typography>
      </Box>
    </Box>
  );
}

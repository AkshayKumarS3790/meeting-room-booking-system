"use client";

import { Box, Typography, Drawer, useMediaQuery } from "@mui/material";
import { useRouter } from "next/navigation";

const menuItems = [
  { name: "Home", path: "/" },
  { name: "Rooms", path: "/rooms" },
  { name: "Bookings", path: "/bookings" },
  { name: "Calendar", path: "/calendar" },
  // { name: "Reports", path: "/reports" },
];

export default function Sidebar({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}) {
  const isMobile = useMediaQuery("(max-width:900px)");
  const router = useRouter();

  const sidebarContent = (
    <Box
      sx={{
        width: 220,
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "#1e1e2f",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 2,
      }}
    >
      {/* TOP */}
      <Box>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          MeetSpace
        </Typography>

        <Box
          sx={{
            height: 2,
            backgroundColor: "#7c4dff",
            mb: 2,
          }}
        />

        {menuItems.map((item) => (
          <Box
            key={item.name}
            onClick={() => router.push(item.path)}
            sx={{
              py: 1.2,
              px: 1,
              borderRadius: 2,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#432f7b",
              },
            }}
          >
            {item.name}
          </Box>
        ))}
      </Box>

      {/* BOTTOM */}
      <Box>
        <Box sx={{ py: 1.2 }}>Settings</Box>
        <Box sx={{ py: 1.2 }}>Logout</Box>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)}>
        {sidebarContent}
      </Drawer>
    );
  }

  return sidebarContent;
}

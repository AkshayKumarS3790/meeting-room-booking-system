"use client";

import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  Tooltip,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import EventIcon from "@mui/icons-material/Event";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import { useRouter, usePathname } from "next/navigation";

const collapsedWidth = 60;

const menuItems = [
  { text: "Dashboard", icon: <HomeIcon />, path: "/dashboard" },
  { text: "Rooms", icon: <MeetingRoomIcon />, path: "/rooms" },
  { text: "Bookings", icon: <EventIcon />, path: "/bookings" },
  { text: "Calendar", icon: <CalendarMonthIcon />, path: "/calendar" },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Box
      sx={{
        width: collapsedWidth,
        top: "60px",
        height: "100%",
        position: "fixed",
        background: "rgba(18,18,28,.75)",
        backdropFilter: "blur(12px)",
        borderRight: "1px solid rgba(255,255,255,.06)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <List sx={{ mt: 1 }}>
        {menuItems.map((item) => (
          <Tooltip
            key={item.text}
            title={item.text}
            placement="right"
            arrow
            slotProps={{
              tooltip: {
                sx: {
                  fontSize: 12,
                  padding: "8px 10px",
                  // backgroundColor: "#2e2e45",
                  color: "#fff",
                  borderRadius: 1,
                },
              },
            }}
          >
            <ListItemButton
              onClick={() => router.push(item.path)}
              sx={{
                mx: 0.7,
                my: 0.5,
                borderRadius: 2,
                height: 48,
                justifyContent: "center",
                background:
                  pathname === item.path
                    ? "linear-gradient(90deg,#7c4dff,#a674fd)"
                    : "transparent",
                "&:hover": {
                  background:
                    pathname === item.path
                      ? "linear-gradient(90deg,#7c4dff,#a674fd)"
                      : "rgba(124,77,255,.12)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "#fff",
                  "& svg": {
                    fontSize: 24,
                  },
                  minWidth: 0,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    </Box>
  );
}

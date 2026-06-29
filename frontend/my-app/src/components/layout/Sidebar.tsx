"use client";

import {
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import EventIcon from "@mui/icons-material/Event";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MenuIcon from "@mui/icons-material/Menu";

import { useRouter, usePathname } from "next/navigation";

const drawerWidth = 200;
const collapsedWidth = 60;

const menuItems = [
  { text: "Home", icon: <HomeIcon />, path: "/" },
  { text: "Rooms", icon: <MeetingRoomIcon />, path: "/rooms" },
  { text: "Bookings", icon: <EventIcon />, path: "/bookings" },
  { text: "Calendar", icon: <CalendarMonthIcon />, path: "/calendar" },
];

export default function Sidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Box
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        height: "100%",
        position: "fixed",
        backgroundColor: "#1e1e2f",
        color: "#fff",
        transition: "0.3s",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Hamburger INSIDE Sidebar */}
      <Box sx={{ display: "flex", px: 1.5, py: 1.5 }}>
        <IconButton
          onClick={() => setOpen((prev) => !prev)}
          sx={{ color: "#fff" }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Menu */}
      <List sx={{ mt: -1.5 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => router.push(item.path)}
            sx={{
              mx: 0.5,
              my: 0.5,
              borderRadius: 2,
              px: 2,
              height: 48,
              justifyContent: open ? "initial" : "center",
              background: pathname === item.path ? "#2e2e45" : "transparent",
              "&:hover": {
                background: "#2e2e45",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: "#fff",
                minWidth: 0,
                width: 24,
                mr: open ? 2 : "auto",
                justifyContent: "center",
                transition: "all 0.25s ease",
              }}
            >
              {item.icon}
            </ListItemIcon>

            {open && (
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: 14,
                  lineHeight: 1,
                }}
              />
            )}
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}

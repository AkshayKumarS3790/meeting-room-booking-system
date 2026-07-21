"use client";

import {
  Box,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";
import ConfirmDialog from "../common/ConfirmDialog";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/utils/auth";

import { usePathname } from "next/navigation";

export default function Topbar() {
  const [userName, setUserName] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const pathname = usePathname();

  const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/rooms": "Rooms",
    "/bookings": "Bookings",
    "/calendar": "Calendar",
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    setOpenLogoutDialog(true);
  };

  const confirmLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Small delay so user sees the loader
      await new Promise((resolve) => setTimeout(resolve, 800));

      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");

      window.location.href = "/";
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserName(user.user_name);
    }
  }, []);

  return (
    <Box
      sx={{
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        width: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1300,
        background: "rgba(18,18,28,.75)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,.06)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          sx={{
            color: "#fff",
            fontWeight: 700,
            letterSpacing: "0.5px",
            fontSize: {
              xs: "1.2rem",
              md: "1.5rem",
            },
          }}
        >
          {pageTitles[pathname] || "Dashboard"}
        </Typography>
      </Box>

      {/* RIGHT SIDE */}
      <Box
        onClick={handleMenu}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          cursor: "pointer",
          px: 1.25,
          py: 0.75,
          borderRadius: "6px",
          transition: "all .3s ease",

          "&:hover": {
            background: "rgba(124,77,255,.12)",
          },
        }}
      >
        <Avatar
          sx={{
            width: 35,
            height: 35,
            fontSize: 14,
            fontWeight: 700,
            bgcolor: "#7c4dff",
          }}
        >
          {userName?.[0] || "U"}
        </Avatar>

        <Typography sx={{ color: "#fff", fontSize: 14 }}>
          {userName || "User"}
        </Typography>
      </Box>

      {/* DROPDOWN */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        disableScrollLock
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 0.5,
            minWidth: 150,
            background: "#2e2e45",
            color: "#fff",
            borderRadius: 2,
            overflow: "hidden",
          },
        }}
      >
        <MenuItem
          onClick={handleLogout}
          sx={{ gap: 1, "&:hover": { backgroundColor: "#3a3a55" } }}
        >
          <ListItemIcon sx={{ color: "#fff" }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      <ConfirmDialog
        open={openLogoutDialog}
        title="Logout"
        message="Are you sure you want to logout from MeetSpace?"
        confirmText="Logout"
        loadingText="Logging out..."
        isLoading={isLoggingOut}
        onClose={() => setOpenLogoutDialog(false)}
        onConfirm={confirmLogout}
      />
    </Box>
  );
}

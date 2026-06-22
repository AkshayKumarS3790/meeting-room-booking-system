"use client";

import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useState } from "react";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box display="flex">
      {/* SIDEBAR */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* RIGHT SIDE */}
      <Box
        sx={{
          ml: "200px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* TOPBAR */}
        <Topbar setMobileOpen={setMobileOpen} />

        {/* CONTENT */}
        <Box
          sx={{
            p: { xs: 2, md: 4 },
            maxWidth: 1200,
            margin: "0 auto",
            width: "100%",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

"use client";

import React from "react";
import { Box } from "@mui/material";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import ParticlesBackground from "@/components/ui/ParticlesBackground";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ position: "relative", minHeight: "100vh" }}>
      {/* GLOBAL PARTICLES BACKGROUND */}
      <ParticlesBackground />

      <Box sx={{ display: "flex", position: "relative", zIndex: 1 }}>
        {/* SIDEBAR */}
        <Sidebar />

        {/* RIGHT SIDE */}
        <Box
          sx={{
            flexGrow: 1,
            marginLeft: "60px",
            marginTop: "60px",
            minHeight: "calc(100vh - 60px)",
            background: "transparent",
          }}
        >
          {/* TOPBAR */}
          <Topbar />

          {/* MAIN CONTENT */}
          <Box
            sx={{
              px: 4,
              py: 3,
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

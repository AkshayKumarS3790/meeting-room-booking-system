"use client";

import React from "react";
import { Box } from "@mui/material";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

import { useState } from "react";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <Box sx={{ display: "flex" }}>
      {/* SIDEBAR */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* RIGHT SIDE */}
      <Box sx={{ flexGrow: 1, marginLeft: "60px" }}>
        {/* TOPBAR */}
        <Topbar />

        {/* CONTENT */}
        <Box
          sx={{
            px: 4,
            pb: 2,
            pl: 0,
            mt: "50px",
            ml: open ? "150px" : "60px",
            minHeight: "100vh",
            background: "#12121c",
            transition: "margin 0.3s ease",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

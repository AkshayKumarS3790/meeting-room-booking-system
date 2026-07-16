"use client";

import { Box } from "@mui/material";

export default function GradientRing() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        left: "50%",

        width: 600,
        height: 600,

        borderRadius: "50%",

        background: "conic-gradient(from 0deg,#7c4dff,#a674fd,#7c4dff)",

        filter: "blur(150px)",

        transform: "translate(-50%,-50%)",

        animation: "spin 18s linear infinite",

        "@keyframes spin": {
          from: {
            transform: "translate(-50%,-50%) rotate(0deg)",
          },
          to: {
            transform: "translate(-50%,-50%) rotate(360deg)",
          },
        },

        zIndex: 0,
      }}
    />
  );
}

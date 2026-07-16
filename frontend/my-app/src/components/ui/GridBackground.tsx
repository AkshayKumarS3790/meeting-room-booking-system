"use client";

import { Box } from "@mui/material";

export default function GridBackground() {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,

        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,

        backgroundSize: "40px 40px",

        zIndex: 0,

        animation: "moveGrid 25s linear infinite",

        "@keyframes moveGrid": {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "40px 40px",
          },
        },
      }}
    />
  );
}

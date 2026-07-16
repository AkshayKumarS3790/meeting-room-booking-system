"use client";

import { Box } from "@mui/material";

export default function AuroraBackground() {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,

        "&::before": {
          content: '""',
          position: "absolute",
          top: "-20%",
          left: "-20%",

          width: "80vw",
          height: "80vw",

          borderRadius: "50%",

          background:
            "radial-gradient(circle, rgba(124,77,255,0.35) 0%, rgba(124,77,255,0.15) 40%, transparent 70%)",

          filter: "blur(120px)",

          animation: "auroraA 20s ease-in-out infinite alternate",
        },

        "&::after": {
          content: '""',
          position: "absolute",
          bottom: "-20%",
          right: "-20%",

          width: "75vw",
          height: "75vw",

          borderRadius: "50%",

          background:
            "radial-gradient(circle, rgba(166,116,253,0.30) 0%, rgba(166,116,253,0.12) 40%, transparent 70%)",

          filter: "blur(140px)",

          animation: "auroraB 25s ease-in-out infinite alternate",
        },

        "@keyframes auroraA": {
          from: {
            transform: "translate(-50px,-50px) scale(1)",
          },
          to: {
            transform: "translate(100px,80px) scale(1.2)",
          },
        },

        "@keyframes auroraB": {
          from: {
            transform: "translate(50px,50px) scale(1)",
          },
          to: {
            transform: "translate(-100px,-80px) scale(1.15)",
          },
        },
      }}
    />
  );
}

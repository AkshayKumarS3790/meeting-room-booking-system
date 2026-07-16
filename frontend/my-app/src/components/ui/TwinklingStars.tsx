"use client";

import { Box } from "@mui/material";

export default function TwinklingStars() {
  return (
    <>
      {[...Array(40)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: "fixed",

            width: 2,
            height: 2,

            borderRadius: "50%",

            bgcolor: "#fff",

            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,

            animation: `twinkle ${2 + Math.random() * 4}s infinite ease-in-out`,

            "@keyframes twinkle": {
              "0%,100%": {
                opacity: 0.2,
              },
              "50%": {
                opacity: 1,
              },
            },

            zIndex: 0,
          }}
        />
      ))}
    </>
  );
}

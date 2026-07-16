"use client";

import { Box } from "@mui/material";

export default function FloatingSquares() {
  return (
    <>
      {[...Array(10)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: "fixed",
            width: 40 + i * 5,
            height: 40 + i * 5,

            border: "1px solid rgba(124,77,255,0.2)",

            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,

            animation: `float ${10 + i}s infinite ease-in-out`,

            "@keyframes float": {
              "0%,100%": {
                transform: "translateY(0)",
              },
              "50%": {
                transform: "translateY(-50px)",
              },
            },

            zIndex: 0,
          }}
        />
      ))}
    </>
  );
}

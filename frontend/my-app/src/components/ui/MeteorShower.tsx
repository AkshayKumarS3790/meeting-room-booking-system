"use client";

import { Box } from "@mui/material";

export default function MeteorShower() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: "fixed",

            width: "3px",
            height: `${150 + Math.random() * 100}px`,

            background:
              "linear-gradient(to bottom, #ffffff, #c4a3ff, rgba(166,116,253,0))",

            borderRadius: "999px",

            boxShadow:
              "0 0 12px rgba(255,255,255,0.8), 0 0 30px rgba(166,116,253,0.6)",

            // Start from various points on the RIGHT edge
            top: `${Math.random() * 100}%`,
            left: `${105 + Math.random() * 10}%`,

            transform: "rotate(225deg)",

            animation: `meteorShoot ${
              12 + Math.random() * 10
            }s linear infinite`,

            animationDelay: `${Math.random() * 15}s`,

            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}

      <style jsx global>{`
        @keyframes meteorShoot {
          0% {
            transform: translate(0, 0) rotate(225deg);
            opacity: 0;
          }

          5% {
            opacity: 1;
          }

          90% {
            opacity: 1;
          }

          100% {
            transform: translate(-2500px, 2500px) rotate(225deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}

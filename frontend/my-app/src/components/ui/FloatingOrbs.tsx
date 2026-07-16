"use client";

import { Box } from "@mui/material";

const orbs = [
  {
    size: 350,
    color: "rgba(124,77,255,0.25)",
    top: "10%",
    left: "5%",
    duration: 22,
  },
  {
    size: 280,
    color: "rgba(168,116,253,0.22)",
    top: "60%",
    left: "75%",
    duration: 28,
  },
  {
    size: 220,
    color: "rgba(124,77,255,0.18)",
    top: "30%",
    left: "55%",
    duration: 24,
  },
  {
    size: 180,
    color: "rgba(184,140,255,0.15)",
    top: "75%",
    left: "20%",
    duration: 30,
  },
];

export default function FloatingOrbs() {
  return (
    <>
      {orbs.map((orb, index) => (
        <Box
          key={index}
          sx={{
            position: "fixed",

            width: orb.size,
            height: orb.size,

            borderRadius: "50%",

            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,

            top: orb.top,
            left: orb.left,

            filter: "blur(60px)",

            animation: `float${index} ${orb.duration}s ease-in-out infinite alternate`,

            pointerEvents: "none",
            zIndex: 0,

            [`@keyframes float${index}`]: {
              "0%": {
                transform: "translate(0px, 0px) scale(1)",
              },

              "25%": {
                transform: "translate(120px, -80px) scale(1.05)",
              },

              "50%": {
                transform: "translate(-100px, 100px) scale(0.95)",
              },

              "75%": {
                transform: "translate(150px, 50px) scale(1.08)",
              },

              "100%": {
                transform: "translate(-120px, -120px) scale(1)",
              },
            },
          }}
        />
      ))}
    </>
  );
}

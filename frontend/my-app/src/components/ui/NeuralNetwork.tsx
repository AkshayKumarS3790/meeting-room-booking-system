"use client";

import { Box } from "@mui/material";

export default function NeuralNetwork() {
  const nodes = [
    { top: "15%", left: "20%" },
    { top: "25%", left: "40%" },
    { top: "20%", left: "65%" },
    { top: "45%", left: "30%" },
    { top: "55%", left: "60%" },
    { top: "75%", left: "25%" },
    { top: "70%", left: "70%" },
  ];

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {nodes.map((node, index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            top: node.top,
            left: node.left,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#7c4dff",
            boxShadow: "0 0 10px #7c4dff",
            animation: "pulse 3s infinite",

            "@keyframes pulse": {
              "0%,100%": {
                transform: "scale(1)",
              },
              "50%": {
                transform: "scale(1.5)",
              },
            },
          }}
        />
      ))}
    </Box>
  );
}

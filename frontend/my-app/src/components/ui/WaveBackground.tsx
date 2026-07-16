"use client";

import { Box } from "@mui/material";

export default function WaveBackground() {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          width: "200%",
          animation: "moveWave 30s linear infinite",

          "@keyframes moveWave": {
            from: {
              transform: "translateX(0)",
            },
            to: {
              transform: "translateX(-50%)",
            },
          },
        }}
      >
        <svg
          viewBox="0 0 2880 320"
          preserveAspectRatio="none"
          style={{
            width: "100%",
            height: "300px",
          }}
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(124,77,255,0.25)" />
              <stop offset="100%" stopColor="rgba(124,77,255,0)" />
            </linearGradient>
          </defs>

          <path
            fill="url(#waveGradient)"
            d="M0,192L60,176C120,160,240,128,360,133.3C480,139,600,181,720,192C840,203,960,181,1080,160C1200,139,1320,117,1440,128C1560,139,1680,181,1800,186.7C1920,192,2040,160,2160,138.7C2280,117,2400,107,2520,117.3C2640,128,2760,160,2820,176L2880,192V320H0Z"
          />
        </svg>
      </Box>
    </Box>
  );
}

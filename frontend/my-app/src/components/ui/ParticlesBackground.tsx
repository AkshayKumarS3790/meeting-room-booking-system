"use client";

import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function ParticlesBackground() {
  const particlesInit = async (engine: any) => {
    await loadSlim(engine);
  };

  return (
    <Particles
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: 0 },
        particles: {
          number: { value: 30 },
          size: { value: 2 },
          move: { enable: true, speed: 0.4 },
          links: {
            enable: true,
            distance: 120,
            color: "#7c4dff",
            opacity: 0.2,
          },
          color: { value: "#7c4dff" },
          opacity: { value: 0.3 },
        },
      }}
      style={{
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
}

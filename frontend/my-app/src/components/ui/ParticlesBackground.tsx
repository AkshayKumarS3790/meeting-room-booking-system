"use client";

import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function ParticlesBackground() {
  const particlesInit = async (engine: unknown) => {
    await loadSlim(engine as never);
  };

  return (
    <Particles
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: 0 },
        particles: {
          number: { value: 25 },
          size: { value: 2 },
          move: { enable: true, speed: 0.5 },
          links: {
            enable: true,
            distance: 100,
            color: "#a280ff",
            opacity: 0.2,
          },
          color: { value: "#a280ff" },
          opacity: { value: 0.5 },
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

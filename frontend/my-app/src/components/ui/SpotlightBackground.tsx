"use client";

import { useEffect, useState } from "react";

export default function SpotlightBackground() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", move);

    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,

        background: `radial-gradient(
          400px circle at ${position.x}px ${position.y}px,
          rgba(124,77,255,0.12),
          transparent 60%
        )`,
      }}
    />
  );
}

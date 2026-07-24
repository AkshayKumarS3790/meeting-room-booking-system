"use client";

import { Box } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import FloatingOrbs from "@/components/ui/FloatingOrbs";
import ParticlesBacground from "@/components/ui/ParticlesBackground";

import CTASection from "@/components/landing/CTASection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HeroSection from "@/components/landing/HeroSection";
import LandingNavbar from "@/components/landing/LandingNavbar";
import WorkflowSection from "@/components/landing/WorkflowSection";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const decoded = jwtDecode<{ exp: number }>(token);

      if (decoded.exp * 1000 > Date.now()) {
        router.replace("/dashboard");
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
    }
  }, [router]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#12121c",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <ParticlesBacground />
      <FloatingOrbs />

      <LandingNavbar />

      <Box
        sx={{
          pt: "70px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <HeroSection
          onLogin={() => router.push("/login")}
          onRegister={() => router.push("/register")}
        />

        <FeaturesSection />

        <WorkflowSection />

        <CTASection onRegister={() => router.push("/register")} />
      </Box>
    </Box>
  );
}

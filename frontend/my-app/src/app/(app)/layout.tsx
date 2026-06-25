// (app) folder's layout.tsx file

"use client";

import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return <LayoutWrapper>{children}</LayoutWrapper>;
}

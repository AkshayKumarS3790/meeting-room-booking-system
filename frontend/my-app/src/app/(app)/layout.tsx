// (app) folder's layout.tsx file

"use client";

import LayoutWrapper from "@/components/layout/LayoutWrapper";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}

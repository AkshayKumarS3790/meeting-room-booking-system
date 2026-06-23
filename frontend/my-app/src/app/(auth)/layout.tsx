// (auth) folder's layout.tsx file

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>; // ✅ no sidebar or topbar
}

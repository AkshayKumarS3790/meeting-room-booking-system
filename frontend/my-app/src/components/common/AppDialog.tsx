"use client";

import { Dialog, DialogTitle, DialogContent } from "@mui/material";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  fullWidth?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
};

export default function AppDialog({
  open,
  title,
  onClose,
  children,
  fullWidth = false,
  maxWidth = "sm",
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableScrollLock
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      PaperProps={{
        sx: {
          backgroundColor: "#1e1e2f",
          color: "#fff",
          borderRadius: 3,
          padding: 1,

          maxWidth: 500,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold" }}>{title}</DialogTitle>

      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}

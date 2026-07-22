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
      BackdropProps={{
        sx: {
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(0,0,0,.55)",
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: 4,
          border: "1px solid rgba(255,255,255,.08)",
          backgroundColor: "#1e1e2f",
          color: "#fff",
          padding: 1,
          overflow: "visible",
        },
      }}
    >
      {title && (
        <DialogTitle
          sx={{
            fontWeight: "bold",
          }}
        >
          {title}
        </DialogTitle>
      )}

      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}

"use client";

import { DialogActions } from "@mui/material";

export default function AppDialogActions({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DialogActions
      sx={{
        px: 0,
        pb: 0.5,
      }}
    >
      {children}
    </DialogActions>
  );
}

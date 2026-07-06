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
        px: 3,
        pb: 2,
      }}
    >
      {children}
    </DialogActions>
  );
}

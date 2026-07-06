"use client";

import { Snackbar, Alert } from "@mui/material";

type Props = {
  open: boolean;
  message: string;
  severity: "success" | "error";
  onClose: () => void;
};

export default function AppSnackbar({
  open,
  message,
  severity,
  onClose,
}: Props) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      onClose={onClose}
    >
      <Alert severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}

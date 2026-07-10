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
      autoHideDuration={5000}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      onClose={onClose}
      sx={{
        zIndex: 99999,
      }}
    >
      <Alert
        severity={severity}
        variant="filled"
        onClose={onClose}
        sx={{
          width: "100%",
          maxWidth: "900px",
          fontWeight: 600,

          "& .MuiAlert-message": {
            lineHeight: 1.5,
          },

          ...(severity === "error" && {
            backgroundColor: "#f23737",
            color: "#fff",

            "& .MuiAlert-icon": {
              color: "#fff",
            },
          }),

          ...(severity === "success" && {
            backgroundColor: "#24cd3e",
            color: "#fff",

            "& .MuiAlert-icon": {
              color: "#fff",
            },
          }),
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

"use client";

import { DialogContent, Typography } from "@mui/material";

import AppDialog from "./AppDialog";
import AppDialogActions from "./AppDialogActions";
import PrimaryButton from "./PrimaryButton";
import DangerButton from "./DangerButton";

type Props = {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  children?: React.ReactNode;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = "Delete",
  children,
}: Props) {
  return (
    <AppDialog open={open} onClose={onClose} title={title}>
      <DialogContent>
        <Typography>{message}</Typography>

        {children}
      </DialogContent>

      <AppDialogActions>
        <PrimaryButton onClick={onClose}>Cancel</PrimaryButton>

        <DangerButton onClick={onConfirm}>{confirmText}</DangerButton>
      </AppDialogActions>
    </AppDialog>
  );
}

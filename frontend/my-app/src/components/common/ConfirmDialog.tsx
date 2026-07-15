"use client";

import { DialogContent, Typography, Tooltip } from "@mui/material";

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
  confirmDisabled?: boolean;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = "Delete",
  children,
  confirmDisabled = false,
}: Props) {
  return (
    <AppDialog open={open} onClose={onClose} title={title} maxWidth="xs">
      <DialogContent sx={{ pt: 0.5, pr: 0.5, pb: 0.5 }}>
        <Typography>{message}</Typography>

        {children}
      </DialogContent>

      <AppDialogActions>
        <PrimaryButton sx={{ mt: 0.5 }} onClick={onClose}>
          Cancel
        </PrimaryButton>

        <Tooltip
          title={confirmDisabled ? "Please select the checkbox first" : ""}
          arrow
        >
          <span>
            <DangerButton
              sx={{ mt: 0.5 }}
              onClick={onConfirm}
              disabled={confirmDisabled}
            >
              {confirmText}
            </DangerButton>
          </span>
        </Tooltip>
      </AppDialogActions>
    </AppDialog>
  );
}

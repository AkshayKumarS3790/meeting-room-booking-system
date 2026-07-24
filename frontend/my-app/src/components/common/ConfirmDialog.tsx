"use client";

import {
  CircularProgress,
  DialogContent,
  Tooltip,
  Typography,
} from "@mui/material";

import AppDialog from "./AppDialog";
import AppDialogActions from "./AppDialogActions";
import DangerButton from "./DangerButton";
import PrimaryButton from "./PrimaryButton";

type Props = {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  children?: React.ReactNode;
  confirmDisabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  isLoading = false,
  children,
  loadingText = "Processing...",
  confirmDisabled = false,
}: Props) {
  return (
    <AppDialog open={open} onClose={onClose} title={title} maxWidth="xs">
      <DialogContent
        sx={{
          px: 0,
          pt: 1,
          pb: 1,
        }}
      >
        {" "}
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
              disabled={confirmDisabled || isLoading}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
                  {loadingText}
                </>
              ) : (
                confirmText
              )}
            </DangerButton>
          </span>
        </Tooltip>
      </AppDialogActions>
    </AppDialog>
  );
}

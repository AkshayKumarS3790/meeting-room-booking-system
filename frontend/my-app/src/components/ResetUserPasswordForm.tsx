"use client";

import { useState } from "react";

import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockResetIcon from "@mui/icons-material/LockReset";

import { useResetUserPasswordMutation } from "@/redux/api";

import DarkTextField from "./common/DarkTextField";
import PrimaryButton from "./common/PrimaryButton";
import SecondaryButton from "./common/SecondaryButton";
import AppSnackbar from "./common/AppSnackbar";

type Props = {
  userId: number;
  onClose: () => void;
};

export default function ResetUserPasswordForm({ userId, onClose }: Props) {
  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNew, setShowNew] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const [showPasswordHelp, setShowPasswordHelp] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [message, setMessage] = useState("");

  const [severity, setSeverity] = useState<"success" | "error">("success");

  const [resetPassword, { isLoading }] = useResetUserPasswordMutation();

  const validatePassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(password);

  const passwordRules = {
    length: newPassword.length >= 6,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /\d/.test(newPassword),
    special: /[@$!%*?&]/.test(newPassword),
  };

  async function handleSubmit() {
    if (!newPassword || !confirmPassword) {
      setMessage("All fields are required");
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (!validatePassword(newPassword)) {
      setMessage(
        "Password must contain uppercase, lowercase, number and special character",
      );

      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");

      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      await resetPassword({
        user_id: userId,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }).unwrap();

      setMessage("Password reset successfully");

      setSeverity("success");
      setOpenSnackbar(true);

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch {
      setMessage("Unable to reset password");

      setSeverity("error");
      setOpenSnackbar(true);
    }
  }

  return (
    <>
      <Box
        sx={{
          maxWidth: 520,
          mx: "auto",
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            textAlign: "center",
            mb: 3,
            mt: -1,
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#7c4dff,#a674fd)",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              mx: "auto",
              mb: 1,

              boxShadow: "0 8px 24px rgba(124,77,255,.35)",
            }}
          >
            <LockResetIcon
              sx={{
                color: "#fff",
                fontSize: 20,
              }}
            />
          </Box>

          <Typography
            sx={{
              color: "#fff",
              fontWeight: 700,
              fontSize: {
                xs: "1.4rem",
                md: "1.8rem",
              },
            }}
          >
            Reset Password
          </Typography>

          <Typography
            sx={{
              color: "#aaa",
              mt: 1,
              fontSize: ".85rem",
            }}
          >
            Create a temporary password for this user account.
          </Typography>
        </Box>

        {/* NEW PASSWORD */}
        <Box position="relative">
          <DarkTextField
            fullWidth
            label="New Password"
            value={newPassword}
            type={showNew ? "text" : "password"}
            onFocus={() => setShowPasswordHelp(true)}
            onBlur={() => setTimeout(() => setShowPasswordHelp(false), 200)}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    sx={{ color: "#777" }}
                    onClick={() => setShowNew(!showNew)}
                  >
                    {showNew ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {showPasswordHelp && (
            <Box
              sx={{
                position: "absolute",
                left: 0,
                right: 0,
                zIndex: 10,
                p: 2,

                background: "linear-gradient(180deg,#252544,#1c1c32)",

                border: "1px solid rgba(124,77,255,.18)",

                borderRadius: 3,

                boxShadow: "0 15px 40px rgba(0,0,0,.35)",
              }}
            >
              <Typography
                sx={{
                  color: "#fff",
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                Password Requirements
              </Typography>

              <Typography color={passwordRules.length ? "#24cd3e" : "#f23737"}>
                {passwordRules.length ? "✓" : "✗"} At least 6 characters
              </Typography>

              <Typography
                color={passwordRules.uppercase ? "#24cd3e" : "#f23737"}
              >
                {passwordRules.uppercase ? "✓" : "✗"} One uppercase letter
              </Typography>

              <Typography
                color={passwordRules.lowercase ? "#24cd3e" : "#f23737"}
              >
                {passwordRules.lowercase ? "✓" : "✗"} One lowercase letter
              </Typography>

              <Typography color={passwordRules.number ? "#24cd3e" : "#f23737"}>
                {passwordRules.number ? "✓" : "✗"} One number
              </Typography>

              <Typography color={passwordRules.special ? "#24cd3e" : "#f23737"}>
                {passwordRules.special ? "✓" : "✗"} One special character
              </Typography>
            </Box>
          )}
        </Box>

        {/* CONFIRM PASSWORD */}
        <DarkTextField
          fullWidth
          label="Confirm Password"
          value={confirmPassword}
          type={showConfirm ? "text" : "password"}
          onChange={(e) => setConfirmPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  sx={{ color: "#777" }}
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {confirmPassword && (
          <Box
            sx={{
              p: 1.25,
              mb: 2,
              borderRadius: 2,

              background:
                confirmPassword === newPassword
                  ? "rgba(36,205,62,.08)"
                  : "rgba(242,55,55,.08)",

              border:
                confirmPassword === newPassword
                  ? "1px solid rgba(36,205,62,.15)"
                  : "1px solid rgba(242,55,55,.15)",
            }}
          >
            <Typography
              sx={{
                color: confirmPassword === newPassword ? "#24cd3e" : "#f23737",

                fontSize: ".88rem",
                fontWeight: 600,
              }}
            >
              {confirmPassword === newPassword
                ? "✓ Passwords match"
                : "✗ Passwords do not match"}
            </Typography>
          </Box>
        )}

        <Box display="flex" justifyContent="flex-end" gap={1.5}>
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>

          <PrimaryButton
            onClick={handleSubmit}
            disabled={
              isLoading || !newPassword.trim() || !confirmPassword.trim()
            }
            sx={{
              "&.Mui-disabled": {
                opacity: 0.55,
                color: "#fff",
                background: "linear-gradient(90deg, #7c4dff, #a674fd)",
              },
            }}
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </PrimaryButton>
        </Box>
      </Box>

      <AppSnackbar
        open={openSnackbar}
        message={message}
        severity={severity}
        onClose={() => setOpenSnackbar(false)}
      />
    </>
  );
}

"use client";

import { useState } from "react";

import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";

import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import AppSnackbar from "./common/AppSnackbar";
import DarkTextField from "./common/DarkTextField";
import PrimaryButton from "./common/PrimaryButton";

import { useChangePasswordMutation } from "@/redux/api";

export default function ChangePasswordForm({
  onClose,
}: {
  onClose: () => void;
}) {
  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);

  const [showNew, setShowNew] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const [showPasswordHelp, setShowPasswordHelp] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [message, setMessage] = useState("");

  const [severity, setSeverity] = useState<"success" | "error">("success");

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const validatePassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(password);

  const passwordRules = {
    length: newPassword.length >= 6,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /\d/.test(newPassword),
    special: /[@$!%*?&]/.test(newPassword),
  };

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
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
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }).unwrap();

      setMessage("Password changed successfully");

      setSeverity("success");
      setOpenSnackbar(true);

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch {
      setMessage("Unable to change password");

      setSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <Box>
        {/* HEADER */}
        <Box
          sx={{
            textAlign: "center",
            mb: 3,
            mt: -2,
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
              mt: 2,
              boxShadow: "0 8px 24px rgba(124,77,255,.35)",
            }}
          >
            <SecurityRoundedIcon
              sx={{
                color: "#fff",
                fontSize: 18,
              }}
            />
          </Box>

          <Typography
            sx={{
              color: "#fff",
              fontWeight: 700,
              fontSize: {
                xs: "1.5rem",
                sm: "1.7rem",
                md: "1.9rem",
              },
            }}
          >
            Account Security
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "#aaa",
              fontSize: "0.8rem",
              maxWidth: 450,
              mx: "auto",
            }}
          >
            Create a strong password to keep your MeetSpace account secure.
          </Typography>
        </Box>

        {/* CURRENT PASSWORD */}
        <DarkTextField
          fullWidth
          label="Current Password"
          type={showCurrent ? "text" : "password"}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  sx={{ color: "#777" }}
                  onClick={() => setShowCurrent(!showCurrent)}
                >
                  {showCurrent ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* NEW PASSWORD */}
        <Box
          sx={{
            position: "relative",
          }}
        >
          <DarkTextField
            fullWidth
            label="New Password"
            type={showNew ? "text" : "password"}
            value={newPassword}
            onFocus={() => setShowPasswordHelp(true)}
            onBlur={() =>
              setTimeout(() => {
                setShowPasswordHelp(false);
              }, 200)
            }
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

                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: "50%",
                  top: -8,
                  transform: "translateX(-50%) rotate(45deg)",
                  width: 12,
                  height: 12,
                  background: "linear-gradient(180deg,#252544,#1c1c32)",
                  borderTop: "1px solid rgba(124,77,255,.18)",
                  borderLeft: "1px solid rgba(124,77,255,.18)",
                },
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
          type={showConfirm ? "text" : "password"}
          value={confirmPassword}
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

        <PrimaryButton
          disabled={
            isLoading ||
            !currentPassword.trim() ||
            !newPassword.trim() ||
            !confirmPassword.trim()
          }
          onClick={handleSubmit}
          sx={{
            width: "100%",
            py: 1.2,
            boxShadow: "0 6px 20px rgba(124,77,255,.35)",
            fontSize: "0.9rem",
            fontWeight: 700,

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
              Updating...
            </>
          ) : (
            "Update Password"
          )}
        </PrimaryButton>
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

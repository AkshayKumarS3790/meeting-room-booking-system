// Edit Profile Form (For the user profile editing)
"use client";

import { useState } from "react";

import { Box, CircularProgress, Typography } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";

import { getCurrentUser } from "@/utils/currentUser";

import { useUpdateProfileMutation } from "@/redux/api";

import AppSnackbar from "./common/AppSnackbar";
import DarkTextField from "./common/DarkTextField";
import PrimaryButton from "./common/PrimaryButton";
import SecondaryButton from "./common/SecondaryButton";

type Props = {
  onClose: () => void;
};

export default function EditProfileForm({ onClose }: Props) {
  const user = getCurrentUser();

  const [userName, setUserName] = useState(user?.user_name ?? "");

  const [email, setEmail] = useState(user?.email ?? "");

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [message, setMessage] = useState("");

  const [severity, setSeverity] = useState<"success" | "error">("success");

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const hasChanges = userName !== user?.user_name || email !== user?.email;

  async function handleSubmit() {
    if (!userName.trim() || !email.trim()) {
      setMessage("All fields are required");

      setSeverity("error");
      setOpenSnackbar(true);

      return;
    }

    try {
      await updateProfile({
        user_name: userName,
        email,
      }).unwrap();

      const currentUser = getCurrentUser();

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...currentUser,
          user_name: userName,
          email,
        }),
      );

      setMessage("Profile updated successfully");

      setSeverity("success");
      setOpenSnackbar(true);

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch {
      setMessage("Unable to update profile");

      setSeverity("error");
      setOpenSnackbar(true);
    }
  }

  return (
    <>
      <Box
        sx={{
          maxWidth: 360,
          mx: "auto",
          width: "100%",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            mb: 2,
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
            <EditIcon
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
            Edit Profile
          </Typography>

          <Typography
            sx={{
              color: "#aaa",
              mt: 1,
              fontSize: ".85rem",
            }}
          >
            Update your account information.
          </Typography>
        </Box>

        <DarkTextField
          fullWidth
          label="User Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          sx={{
            mb: 2,
          }}
        />

        <DarkTextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            mb: 2,
          }}
        />

        <Box display="flex" justifyContent="center" gap={1.5} mt={3}>
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>

          <PrimaryButton
            onClick={handleSubmit}
            disabled={isLoading || !hasChanges}
            sx={{
              "&.Mui-disabled": {
                opacity: 0.65,
                color: "#fff",
                background: "linear-gradient(90deg,#7c4dff,#a674fd)",
              },
            }}
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Saving...
              </>
            ) : (
              "Save Changes"
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

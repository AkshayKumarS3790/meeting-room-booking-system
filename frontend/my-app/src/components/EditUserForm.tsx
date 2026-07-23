// Edit user form file
"use client";

import { useState } from "react";

import { Box, Typography, CircularProgress } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";

import { User, useUpdateUserMutation } from "@/redux/api";

import DarkTextField from "./common/DarkTextField";
import FilterSelect from "./common/FilterSelect";
import PrimaryButton from "./common/PrimaryButton";
import SecondaryButton from "./common/SecondaryButton";
import AppSnackbar from "./common/AppSnackbar";

type Props = {
  user: User;
  onClose: () => void;
};

export default function EditUserForm({ user, onClose }: Props) {
  const [userName, setUserName] = useState(user.user_name);

  const [email, setEmail] = useState(user.email);

  const [role, setRole] = useState(user.role);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [message, setMessage] = useState("");

  const [severity, setSeverity] = useState<"success" | "error">("success");

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const hasChanges =
    userName !== user.user_name || email !== user.email || role !== user.role;

  async function handleSubmit() {
    if (!userName.trim() || !email.trim()) {
      setMessage("All fields are required");

      setSeverity("error");
      setOpenSnackbar(true);

      return;
    }

    try {
      await updateUser({
        user_id: user.user_id,
        user_name: userName,
        email,
        role,
      }).unwrap();

      setMessage("User updated successfully");

      setSeverity("success");
      setOpenSnackbar(true);

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch {
      setMessage("Unable to update user");

      setSeverity("error");
      setOpenSnackbar(true);
    }
  }

  return (
    <>
      <Box
        sx={{
          maxWidth: 420,
          mx: "auto",
          width: "100%",
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            textAlign: "center",
            mb: 2,
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
              mb: -0.5,
              fontSize: {
                xs: "1.4rem",
                md: "1.8rem",
              },
            }}
          >
            Edit User
          </Typography>

          <Typography
            sx={{
              color: "#aaa",
              mt: 1,
              fontSize: ".85rem",
              maxWidth: 260,
              mx: "auto",
            }}
          >
            Update user details and role.
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

        <Box
          mt={1}
          sx={{
            width: "100%",
          }}
        >
          <FilterSelect
            label="Role"
            value={role}
            fullWidth
            // minWidth={378}
            onChange={(e) => setRole(e.target.value)}
            options={[
              {
                value: "admin",
                label: "Admin",
              },
              {
                value: "manager",
                label: "Manager",
              },
              {
                value: "employee",
                label: "Employee",
              },
            ]}
          />
        </Box>

        <Box display="flex" justifyContent="flex-end" gap={1.5} mt={2}>
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

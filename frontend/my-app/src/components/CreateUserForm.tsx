// Create user form (Admin Only)
"use client";

import { useState } from "react";

import { Box, Typography, CircularProgress } from "@mui/material";

import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

import { useCreateUserMutation } from "@/redux/api";

import DarkTextField from "./common/DarkTextField";
import FilterSelect from "./common/FilterSelect";
import PrimaryButton from "./common/PrimaryButton";
import SecondaryButton from "./common/SecondaryButton";
import AppSnackbar from "./common/AppSnackbar";

type Props = {
  onClose: () => void;
};

export default function CreateUserForm({ onClose }: Props) {
  const [userName, setUserName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [role, setRole] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [message, setMessage] = useState("");

  const [severity, setSeverity] = useState<"success" | "error">("success");

  const [createUser, { isLoading }] = useCreateUserMutation();

  async function handleSubmit() {
    if (!userName.trim() || !email.trim() || !password.trim() || !role) {
      setMessage("All fields are required");

      setSeverity("error");
      setOpenSnackbar(true);

      return;
    }

    if (password.length < 8) {
      setMessage("Temporary password must be at least 8 characters long");

      setSeverity("error");
      setOpenSnackbar(true);

      return;
    }

    try {
      await createUser({
        user_name: userName,
        email,
        password,
        role,
      }).unwrap();

      setMessage("User created successfully");

      setSeverity("success");
      setOpenSnackbar(true);

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch {
      setMessage("Unable to create user");

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

              background: "linear-gradient(135deg, #7c4dff, #a674fd)",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              mx: "auto",
              mb: 1,

              boxShadow: "0 8px 24px rgba(124,77,255,.35)",
            }}
          >
            <PersonAddAlt1Icon
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
            Add User
          </Typography>

          <Typography
            sx={{
              color: "#aaa",
              mt: 1,
              fontSize: ".85rem",
            }}
          >
            Create a new user account.
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

        <Box mb={2}>
          <FilterSelect
            label="Role"
            value={role}
            fullWidth
            onChange={(e) => setRole(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: 56,
                backgroundColor: "#37374c",
                borderRadius: 2,

                "&:hover fieldset": {
                  borderColor: "#7c4dff",
                },
              },

              "& .MuiInputLabel-root": {
                color: "#aaa",
              },

              "& .MuiSelect-select": {
                color: "#fff",
              },

              "& .MuiSvgIcon-root": {
                color: "#fff",
              },
            }}
            options={[
              {
                value: "",
                label: "Select Role",
              },
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

        <DarkTextField
          fullWidth
          type="password"
          label="Temporary Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helperText="User should change this password after first login."
          FormHelperTextProps={{
            sx: {
              color: "#aaa",
              ml: 0,
              mt: 0.5,
              fontSize: "0.8rem",
            },
          }}
        />

        <Box display="flex" justifyContent="center" gap={1.5}>
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>

          <PrimaryButton
            onClick={handleSubmit}
            disabled={
              isLoading ||
              !userName.trim() ||
              !email.trim() ||
              !password.trim() ||
              !role
            }
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
                Creating...
              </>
            ) : (
              "Create User"
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

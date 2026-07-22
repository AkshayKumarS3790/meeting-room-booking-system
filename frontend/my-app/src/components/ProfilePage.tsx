"use client";

import { useState } from "react";

import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Typography,
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";

import { getCurrentUser } from "@/utils/currentUser";

import AppDialog from "./common/AppDialog";
import ChangePasswordForm from "./ChangePasswordForm";
import PrimaryButton from "./common/PrimaryButton";

export default function ProfilePage() {
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

  const user = getCurrentUser();

  return (
    <>
      <Typography
        sx={{
          color: "#fff",
          fontWeight: 700,
          mb: 1,
          mt: -1.5,
          fontSize: {
            xs: "1.7rem",
            md: "2rem",
          },
        }}
      >
        My Profile
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Card
          sx={{
            background: "linear-gradient(180deg,#252544,#1c1c32)",
            borderRadius: 4,
            border: "1px solid rgba(255,255,255,.06)",
            color: "#fff",

            transition: "all .3s ease",

            "&:hover": {
              borderColor: "rgba(124,77,255,.25)",
              boxShadow: "0 16px 45px rgba(124,77,255,.18)",
            },
          }}
        >
          <CardContent
            sx={{
              p: 3,
              textAlign: "center",
            }}
          >
            <Avatar
              sx={{
                width: 90,
                height: 90,

                mx: "auto",
                mb: 2,

                background: "linear-gradient(135deg,#7c4dff,#a674fd)",

                fontSize: "3rem",
                fontWeight: 700,

                boxShadow: "0 12px 35px rgba(124,77,255,.35)",
              }}
            >
              {user?.user_name?.[0] || "U"}
            </Avatar>

            <Typography
              sx={{
                fontSize: {
                  xs: "1.5rem",
                  md: "2rem",
                },

                fontWeight: 700,
                mb: 1,
              }}
            >
              {user?.user_name}
            </Typography>

            <Chip
              label={user?.role}
              sx={{
                textTransform: "capitalize",
                background: "linear-gradient(90deg,#7c4dff,#a674fd)",
                color: "#fff",
                fontWeight: 500,
                px: 1,
                mb: 2,
              }}
            />

            <Divider
              sx={{
                mb: 2,
                borderColor: "rgba(255,255,255,.08)",
              }}
            />

            <Box
              sx={{
                maxWidth: 500,
                mx: "auto",
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={1}
                mb={0.5}
              >
                <EmailIcon
                  sx={{
                    color: "#a674fd",
                    fontSize: 20,
                  }}
                />

                <Typography
                  sx={{
                    color: "#eee",
                    fontWeight: 500,
                    fontSize: 15,
                  }}
                >
                  Email Address
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  wordBreak: "break-word",
                }}
              >
                {user?.email}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* RIGHT CONTENT */}
        <Box display="flex" flexDirection="column" gap={3}>
          {/* SECURITY */}
          <Card
            sx={{
              background: "linear-gradient(180deg,#252544,#1c1c32)",
              borderRadius: 4,
              border: "1px solid rgba(255,255,255,.06)",
              color: "#fff",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <SecurityRoundedIcon
                  sx={{
                    color: "#a674fd",
                  }}
                />

                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "1.2rem",
                  }}
                >
                  Account Security
                </Typography>
              </Box>

              <Typography
                sx={{
                  color: "#fff",
                  mb: 2,
                  fontSize: 15,
                }}
              >
                Update your password periodically to keep your MeetSpace account
                secure.
              </Typography>

              <Divider
                sx={{
                  borderColor: "rgba(255,255,255,.07)",
                  mb: 2,
                }}
              />

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={2}
              >
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    Password
                  </Typography>

                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: "0.9rem",
                    }}
                  >
                    Change your account password.
                  </Typography>
                </Box>

                <PrimaryButton onClick={() => setOpenPasswordDialog(true)}>
                  Change Password
                </PrimaryButton>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <AppDialog
        open={openPasswordDialog}
        onClose={() => setOpenPasswordDialog(false)}
        title=""
        fullWidth
        maxWidth="xs"
      >
        <ChangePasswordForm onClose={() => setOpenPasswordDialog(false)} />
      </AppDialog>
    </>
  );
}

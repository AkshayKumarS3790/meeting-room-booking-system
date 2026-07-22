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

import SecurityIcon from "@mui/icons-material/Security";
import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";

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
          mb: 3,
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
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "340px 1fr",
          },
          gap: 3,
        }}
      >
        {/* LEFT PROFILE CARD */}
        <Card
          sx={{
            background: "linear-gradient(180deg,#252544,#1c1c32)",
            borderRadius: 4,
            color: "#fff",
            border: "1px solid rgba(255,255,255,.06)",
            height: "fit-content",
          }}
        >
          <CardContent
            sx={{
              p: 4,
              textAlign: "center",
            }}
          >
            <Avatar
              sx={{
                width: 110,
                height: 110,
                mx: "auto",
                mb: 2,

                background: "linear-gradient(135deg,#7c4dff,#a674fd)",

                fontSize: "2.7rem",
                fontWeight: 700,
              }}
            >
              {user?.user_name?.[0] || "U"}
            </Avatar>

            <Typography
              sx={{
                fontSize: "1.7rem",
                fontWeight: 700,
              }}
            >
              {user?.user_name}
            </Typography>

            <Typography
              sx={{
                mt: 1,
                color: "#aaa",
                wordBreak: "break-word",
              }}
            >
              {user?.email}
            </Typography>

            <Chip
              label={user?.role}
              sx={{
                mt: 2,
                textTransform: "capitalize",
                background: "linear-gradient(90deg,#7c4dff,#a674fd)",
                color: "#fff",
                fontWeight: 600,
              }}
            />
          </CardContent>
        </Card>

        {/* RIGHT CONTENT */}
        <Box display="flex" flexDirection="column" gap={3}>
          {/* ACCOUNT DETAILS */}
          <Card
            sx={{
              background: "linear-gradient(180deg,#252544,#1c1c32)",
              borderRadius: 4,
              border: "1px solid rgba(255,255,255,.06)",
              color: "#fff",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "1.3rem",
                  mb: 3,
                }}
              >
                Account Information
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "1fr 1fr",
                  },
                  gap: 3,
                }}
              >
                <Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <BadgeIcon
                      sx={{
                        color: "#a674fd",
                        fontSize: 20,
                      }}
                    />

                    <Typography color="#888">User ID</Typography>
                  </Box>

                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.2rem",
                    }}
                  >
                    {user?.user_id}
                  </Typography>
                </Box>

                <Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <SecurityIcon
                      sx={{
                        color: "#a674fd",
                        fontSize: 20,
                      }}
                    />

                    <Typography color="#888">Role</Typography>
                  </Box>

                  <Typography
                    sx={{
                      textTransform: "capitalize",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                    }}
                  >
                    {user?.role}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    gridColumn: {
                      md: "1 / span 2",
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <EmailIcon
                      sx={{
                        color: "#a674fd",
                        fontSize: 20,
                      }}
                    />

                    <Typography color="#888">Email Address</Typography>
                  </Box>

                  <Typography
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {user?.email}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* SECURITY */}
          <Card
            sx={{
              background: "linear-gradient(180deg,#252544,#1c1c32)",
              borderRadius: 4,
              border: "1px solid rgba(255,255,255,.06)",
              color: "#fff",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "1.3rem",
                  mb: 2,
                }}
              >
                Account Security
              </Typography>

              <Typography
                sx={{
                  color: "#aaa",
                  mb: 3,
                }}
              >
                Update your password periodically to keep your MeetSpace account
                secure.
              </Typography>

              <Divider
                sx={{
                  borderColor: "rgba(255,255,255,.07)",
                  mb: 3,
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
                      color: "#888",
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
        maxWidth="md"
      >
        <ChangePasswordForm onClose={() => setOpenPasswordDialog(false)} />
      </AppDialog>
    </>
  );
}

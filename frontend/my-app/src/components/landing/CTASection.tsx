"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";

type CTASectionProps = {
  onRegister: () => void;
};

export default function CTASection({ onRegister }: CTASectionProps) {
  return (
    <>
      <Box
        sx={{
          py: 12,

          background:
            "linear-gradient(180deg, rgba(124,77,255,.08), rgba(18,18,28,.2))",

          borderTop: "1px solid rgba(255,255,255,.05)",
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            textAlign: "center",
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 800,

                fontSize: {
                  xs: "1.9rem",
                  sm: "2.3rem",
                  md: "3rem",
                },
              }}
            >
              Your Next Meeting Starts Here.
            </Typography>

            <Typography
              sx={{
                color: "#aaa",
                mt: 2,
                mb: 4,
              }}
            >
              Create your workspace and start booking rooms in minutes.
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={onRegister}
              sx={{
                textTransform: "none",

                px: 4,
                py: 1.5,

                borderRadius: "999px",

                background: "linear-gradient(90deg,#7c4dff,#a674fd)",

                boxShadow: "0 0 30px rgba(124,77,255,.4)",
              }}
            >
              Create Account
            </Button>
          </motion.div>
        </Container>
      </Box>

      <Box
        sx={{
          borderTop: "1px solid rgba(255,255,255,.06)",

          py: 3,

          textAlign: "center",

          color: "#777",
        }}
      >
        © 2026 MeetSpace. All rights reserved.
      </Box>
    </>
  );
}

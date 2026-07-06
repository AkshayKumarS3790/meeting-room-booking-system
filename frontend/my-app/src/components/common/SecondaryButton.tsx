"use client";

import { Button, ButtonProps } from "@mui/material";

export default function SecondaryButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      sx={{
        border: "1px solid #d1b3ff",
        color: "#d1b3ff",
        borderRadius: 2,
        textTransform: "none",

        "&:hover": {
          borderColor: "#b388ff",
          color: "#b388ff",
          backgroundColor: "rgba(179,136,255,0.1)",
        },

        ...(props.sx || {}),
      }}
    />
  );
}

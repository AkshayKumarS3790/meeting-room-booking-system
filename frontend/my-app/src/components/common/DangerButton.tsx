"use client";

import { Button, ButtonProps } from "@mui/material";

export default function DangerButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      variant="outlined"
      color="error"
      sx={{
        borderRadius: 2,
        color: "#fc5d5d",
        borderColor: "#fc5d5d",
        textTransform: "none",

        "&.Mui-disabled": {
          color: "rgba(252, 93, 93, 0.5)",
          borderColor: "rgba(252, 93, 93, 0.35)",
          opacity: 1,
        },

        ...(props.sx || {}),
      }}
    />
  );
}

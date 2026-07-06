"use client";

import { Button, ButtonProps } from "@mui/material";

export default function PrimaryButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      sx={{
        borderRadius: 2,
        textTransform: "none",

        background: "linear-gradient(55deg, #7e4fff, #ad7eff)",

        color: "#fff",

        "&:hover": {
          background: "linear-gradient(55deg, #7340ff, #a674fd)",
        },

        ...(props.sx || {}),
      }}
    />
  );
}

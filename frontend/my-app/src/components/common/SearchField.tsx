"use client";

import { TextField, TextFieldProps } from "@mui/material";

export default function SearchField(props: TextFieldProps) {
  return (
    <TextField
      size="small"
      {...props}
      sx={{
        width: "100%",

        background: "rgba(84, 66, 134, 0.4)",

        borderRadius: 2,

        "& .MuiOutlinedInput-root": {
          borderRadius: 3,
          color: "#fff",

          "& fieldset": {
            borderColor: "transparent",
          },

          "&:hover fieldset": {
            borderColor: "#7c4dff",
          },

          "&.Mui-focused fieldset": {
            borderColor: "#7c4dff",
            boxShadow: "0 0 6px rgba(124,77,255,0.4)",
          },
        },

        "& input::placeholder": {
          color: "#bbb",
          opacity: 1,
        },

        "& input": {
          color: "#fff",
          padding: "8px 12px",
        },

        ...(props.sx || {}),
      }}
    />
  );
}

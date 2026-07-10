"use client";

import { TextField, TextFieldProps } from "@mui/material";

export default function DarkTextField(props: TextFieldProps) {
  return (
    <TextField
      {...props}
      sx={{
        mb: 2,

        "& .MuiOutlinedInput-root": {
          backgroundColor: "#37374c",
          color: "#fff",
          borderRadius: 2,

          "& fieldset": {
            borderColor: "#444",
          },

          "&:hover fieldset": {
            borderColor: "#7c4dff",
          },

          "&.Mui-focused fieldset": {
            borderColor: "#7c4dff",
            borderWidth: "2px",
          },
        },

        "& .MuiInputLabel-root": {
          color: "#aaa",
        },

        "& .MuiInputLabel-root.Mui-focused": {
          color: "#b388ff",
        },

        "& .MuiFormHelperText-root.Mui-error": {
          color: "#ff8a80",
          fontSize: "0.75rem",
        },

        ...(props.sx || {}),
      }}
    />
  );
}

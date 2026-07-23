"use client";

import {
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  SxProps,
  Theme,
} from "@mui/material";

type Option = {
  value: string;
  label: string;
};

type Props = {
  label: string;
  value: string;
  onChange: (event: SelectChangeEvent) => void;
  options: Option[];
  minWidth?: number;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
};

export default function FilterSelect({
  label,
  value,
  onChange,
  options,
  minWidth = 150,
  fullWidth = false,
  sx,
}: Props) {
  return (
    <FormControl
      fullWidth={fullWidth}
      variant="outlined"
      sx={{
        ...(fullWidth ? {} : { minWidth }),

        "& .MuiOutlinedInput-root": {
          height: 40,
          display: "flex",
          alignItems: "center",
          borderRadius: 2,

          "& fieldset": {
            borderColor: "#995eff",
          },

          "&:hover fieldset": {
            borderColor: "#995eff",
          },

          "&.Mui-focused fieldset": {
            borderColor: "#995eff",
            borderWidth: 2,
          },
        },

        "& .MuiInputLabel-root": {
          color: "#d4bbff",
        },

        "& .MuiInputLabel-root.Mui-focused": {
          color: "#995eff",
        },

        "& .MuiSelect-select": {
          paddingTop: "10px",
          paddingBottom: "10px",
          color: "#e0ceff",
        },

        "& .MuiSvgIcon-root": {
          color: "#995eff",
        },

        ...sx,
      }}
    >
      <InputLabel>{label}</InputLabel>

      <Select
        value={value}
        label={label}
        onChange={onChange}
        MenuProps={{
          disableScrollLock: true,
          PaperProps: {
            sx: {
              backgroundColor: "#2e2e45",
              color: "#fff",
              borderRadius: 2,

              maxHeight: 370,
              overflowY: "auto",
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

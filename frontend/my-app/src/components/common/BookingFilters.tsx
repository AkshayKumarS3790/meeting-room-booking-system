"use client";

import { Box } from "@mui/material";

import SearchField from "./SearchField";
import FilterSelect from "./FilterSelect";
import SecondaryButton from "./SecondaryButton";

import { datePickerFieldSx } from "@/utils/datePickerFieldSx";

import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

type Props = {
  search: string;
  setSearch: (value: string) => void;

  selectedDate: string;
  setSelectedDate: (value: string) => void;

  selectedRoom: string;
  setSelectedRoom: (value: string) => void;

  roomOptions: {
    value: string;
    label: string;
  }[];

  clearFilters: () => void;
};

export default function BookingFilters({
  search,
  setSearch,
  selectedDate,
  setSelectedDate,
  selectedRoom,
  setSelectedRoom,
  roomOptions,
  clearFilters,
}: Props) {
  const hasActiveFilters =
    search.trim() !== "" || selectedDate !== "" || selectedRoom !== "all";

  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        xs: "1fr",
        sm: "1fr 1fr",
        md: "1fr 1fr 1fr auto",
      }}
      gap={2}
      alignItems="center"
    >
      <SearchField
        placeholder="Search User"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ maxWidth: 150 }}
      />

      <DatePicker
        label="Date"
        value={selectedDate ? dayjs(selectedDate) : null}
        onChange={(value) =>
          setSelectedDate(value ? value.format("YYYY-MM-DD") : "")
        }
        disablePast
        slotProps={{
          textField: {
            size: "small",
            sx: {
              ...datePickerFieldSx,
              width: 150,
              mb: 0,
              "& .MuiPickersInputBase-root": {
                background: "rgba(84, 66, 134, 0.4)",
                borderRadius: "8px",
              },

              "& .MuiPickersOutlinedInput-notchedOutline": {
                borderColor: "transparent",
                borderRadius: "8px",
              },
            },
          },
        }}
      />

      <FilterSelect
        label="Select Room"
        value={selectedRoom}
        onChange={(e) => setSelectedRoom(e.target.value)}
        options={roomOptions}
      />

      <SecondaryButton
        onClick={clearFilters}
        disabled={!hasActiveFilters}
        sx={{
          "&.Mui-disabled": {
            color: "#8e5ae8",
            borderColor: "#8e5ae8",
            opacity: 0.4,
          },
        }}
      >
        Clear
      </SecondaryButton>
    </Box>
  );
}

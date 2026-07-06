"use client";

import { Box } from "@mui/material";

import SearchField from "./SearchField";
import FilterSelect from "./FilterSelect";
import SecondaryButton from "./SecondaryButton";

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
      />

      <SearchField
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        sx={{
          "& input::-webkit-calendar-picker-indicator": {
            filter: "invert(1)",
            cursor: "pointer",
          },
        }}
      />

      <FilterSelect
        label="Select Room"
        value={selectedRoom}
        onChange={(e) => setSelectedRoom(e.target.value)}
        options={roomOptions}
      />

      <SecondaryButton onClick={clearFilters}>Clear</SecondaryButton>
    </Box>
  );
}

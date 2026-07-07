"use client";

import { Box } from "@mui/material";

import SearchField from "./SearchField";
import FilterSelect from "./FilterSelect";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

type Props = {
  roomSearch: string;
  setRoomSearch: (value: string) => void;

  selectedLocation: string;
  setSelectedLocation: (value: string) => void;

  locationOptions: {
    value: string;
    label: string;
  }[];

  onAddRoom: () => void;

  clearFilters: () => void;
};

export default function RoomFilters({
  roomSearch,
  setRoomSearch,
  selectedLocation,
  setSelectedLocation,
  locationOptions,
  onAddRoom,
  clearFilters,
}: Props) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          md: "2fr 1.5fr auto",
        },
        gap: 2,
        alignItems: "center",
      }}
    >
      <SearchField
        placeholder="Search rooms/capacity"
        value={roomSearch}
        onChange={(e) => setRoomSearch(e.target.value)}
        sx={{ maxWidth: 200 }}
      />

      <FilterSelect
        label="Select Location"
        value={selectedLocation}
        onChange={(e) => setSelectedLocation(e.target.value)}
        options={locationOptions}
      />

      <Box display="flex" gap={1}>
        <PrimaryButton onClick={onAddRoom}>Add Room</PrimaryButton>

        <SecondaryButton onClick={clearFilters}>Clear</SecondaryButton>
      </Box>
    </Box>
  );
}

"use client";

import { Box } from "@mui/material";

import SearchField from "./SearchField";
import FilterSelect from "./FilterSelect";
import PrimaryButton from "./PrimaryButton";

type Props = {
  roomSearch: string;
  setRoomSearch: (value: string) => void;

  capacitySearch: string;
  setCapacitySearch: (value: string) => void;

  selectedLocation: string;
  setSelectedLocation: (value: string) => void;

  locationOptions: {
    value: string;
    label: string;
  }[];

  onAddRoom: () => void;
};

export default function RoomFilters({
  roomSearch,
  setRoomSearch,
  capacitySearch,
  setCapacitySearch,
  selectedLocation,
  setSelectedLocation,
  locationOptions,
  onAddRoom,
}: Props) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          md: "1fr 1fr 1fr auto",
        },
        gap: 2,
        alignItems: "center",
      }}
    >
      <SearchField
        placeholder="Search rooms"
        value={roomSearch}
        onChange={(e) => setRoomSearch(e.target.value)}
      />

      <SearchField
        placeholder="Search capacity"
        value={capacitySearch}
        onChange={(e) => setCapacitySearch(e.target.value)}
      />

      <FilterSelect
        label="Select Location"
        value={selectedLocation}
        onChange={(e) => setSelectedLocation(e.target.value)}
        options={locationOptions}
      />

      <PrimaryButton onClick={onAddRoom}>Add Room</PrimaryButton>
    </Box>
  );
}

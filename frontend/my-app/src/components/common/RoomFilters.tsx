"use client";

import { Box, Tooltip } from "@mui/material";

import FilterSelect from "./FilterSelect";
import PrimaryButton from "./PrimaryButton";
import SearchField from "./SearchField";
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

  onAddRoom?: () => void;

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
  const hasActiveFilters =
    roomSearch.trim() !== "" || selectedLocation !== "all";

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          md: "1fr 1fr auto auto",
        },
        gap: 2,
        alignItems: "center",
      }}
    >
      <SearchField
        placeholder="Search rooms/capacity"
        value={roomSearch}
        onChange={(e) => setRoomSearch(e.target.value)}
        sx={{ maxWidth: 190 }}
      />

      <FilterSelect
        label="Select Location"
        value={selectedLocation}
        onChange={(e) => setSelectedLocation(e.target.value)}
        options={locationOptions}
      />

      <Tooltip
        title={onAddRoom ? "Add a new room" : "Only Admins can add rooms"}
        arrow
      >
        <span
          style={{
            display: "inline-block",
            width: "100%",
          }}
        >
          <PrimaryButton
            onClick={onAddRoom}
            disabled={!onAddRoom}
            sx={{
              width: "100%",

              "&.Mui-disabled": {
                background: "linear-gradient(90deg, #7c4dff, #a674fd)",
                opacity: 0.35,
                color: "#ffffff",
              },
            }}
          >
            Add Room
          </PrimaryButton>
        </span>
      </Tooltip>

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

"use client";

import { Box } from "@mui/material";

import FilterSelect from "./FilterSelect";
import SearchField from "./SearchField";
import SecondaryButton from "./SecondaryButton";

type Props = {
  search: string;
  setSearch: (value: string) => void;

  roleFilter: string;
  setRoleFilter: (value: string) => void;

  sortOrder: string;
  setSortOrder: (value: string) => void;

  clearFilters: () => void;
};

export default function UsersFilters({
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  sortOrder,
  setSortOrder,
  clearFilters,
}: Props) {
  const hasActiveFilters =
    search.trim() !== "" || roleFilter !== "all" || sortOrder !== "default";

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
        sx={{ maxWidth: 180 }}
      />

      <FilterSelect
        label="Role"
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        options={[
          {
            value: "all",
            label: "All Roles",
          },
          {
            value: "admin",
            label: "Admin",
          },
          {
            value: "manager",
            label: "Manager",
          },
          {
            value: "employee",
            label: "Employee",
          },
        ]}
      />

      <FilterSelect
        label="Sort"
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        options={[
          {
            value: "default",
            label: "Sort By",
          },
          {
            value: "asc",
            label: "A → Z",
          },
          {
            value: "desc",
            label: "Z → A",
          },
        ]}
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

"use client";

import { Box, Typography, Select, MenuItem, Pagination } from "@mui/material";

type Props = {
  page: number;
  totalPages: number;
  itemsPerPage: number;
  setPage: (value: number) => void;
  setItemsPerPage: (value: number) => void;
  totalItems: number;
  startItem: number;
  endItem: number;
};

export default function PaginationFooter({
  page,
  totalPages,
  itemsPerPage,
  setPage,
  setItemsPerPage,
  totalItems,
  startItem,
  endItem,
}: Props) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mt={2}
      width="100%"
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Typography sx={{ color: "#ccc", fontSize: 14 }}>Per page</Typography>

        <Select
          size="small"
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setPage(1);
          }}
          MenuProps={{
            disableScrollLock: true,
          }}
          sx={{
            width: 65,
            color: "#fff",
            backgroundColor: "#2e2e45",
            borderRadius: 2,

            "& .MuiSvgIcon-root": { color: "#fff" },

            "& .MuiSvgIcon-select": { textAlign: "center" },
          }}
        >
          {[5, 10, 15, 20].map((num) => (
            <MenuItem key={num} value={num}>
              {num}
            </MenuItem>
          ))}
        </Select>

        <Typography>
          {totalItems === 0
            ? "0-0 of 0"
            : `${startItem}–${endItem} of ${totalItems}`}
        </Typography>
      </Box>

      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, value) => {
          setPage(value);
        }}
        siblingCount={1}
        boundaryCount={1}
        sx={{
          "& .MuiPaginationItem-root": {
            color: "#ccc",
            borderRadius: "12%",
          },

          "& .MuiPaginationItem-root.Mui-selected": {
            backgroundColor: "#995eff",
            color: "#fff",
            fontWeight: "bold",
          },

          "& .MuiPaginationItem-root.Mui-selected:hover": {
            backgroundColor: "#7340ff",
          },
        }}
      />
    </Box>
  );
}

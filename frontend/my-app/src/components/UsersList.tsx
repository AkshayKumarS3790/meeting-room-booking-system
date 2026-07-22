"use client";

import { useDeleteUserMutation } from "@/redux/api";

import { useMemo, useState, useEffect } from "react";

import { Box, Typography, Card } from "@mui/material";

import { useGetUsersQuery, User } from "@/redux/api";

import UsersFilters from "./common/UsersFilters";
import PaginationFooter from "./common/PaginationFooter";

import { canViewUsers } from "@/utils/permissions";
import PageError from "./common/PageError";

import AppDialog from "./common/AppDialog";
import ConfirmDialog from "./common/ConfirmDialog";
import AppSnackbar from "./common/AppSnackbar";

import LockResetIcon from "@mui/icons-material/LockReset";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Button from "@mui/material/Button";

import ResetUserPasswordForm from "./ResetUserPasswordForm";

export default function UsersList() {
  const { data, isLoading, error } = useGetUsersQuery();

  console.log(data);

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] = useState("all");

  const [sortOrder, setSortOrder] = useState("default");

  const [page, setPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [message, setMessage] = useState("");

  const [severity, setSeverity] = useState<"success" | "error">("success");

  const [deleteUser, { isLoading: deletingUser }] = useDeleteUserMutation();

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter, sortOrder]);

  const filteredUsers = useMemo(() => {
    const users = Array.isArray(data) ? data : [];

    const filtered = users.filter((user) => {
      const matchesSearch =
        user.user_name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "all" ||
        user.role?.toLowerCase() === roleFilter.toLowerCase();

      return matchesSearch && matchesRole;
    });

    if (sortOrder === "asc") {
      filtered.sort((a, b) => a.user_name.localeCompare(b.user_name));
    }

    if (sortOrder === "desc") {
      filtered.sort((a, b) => b.user_name.localeCompare(a.user_name));
    }

    return filtered;
  }, [data, search, roleFilter, sortOrder]);

  const totalItems = filteredUsers.length;

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (page - 1) * itemsPerPage;

  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  if (error) {
    return <PageError message="Unable to load users" />;
  }

  if (!canViewUsers()) {
    return (
      <PageError message="You do not have permission to access this page." />
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

          gap: 2,
          mb: 2,

          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 700,

              fontSize: {
                xs: "1.4rem",
                md: "2rem",
              },
            }}
          >
            Users Management
          </Typography>

          <Typography
            sx={{
              color: "#888",

              fontSize: {
                xs: "0.7rem",
                md: "0.95rem",
              },
            }}
          >
            Manage user accounts, roles and permissions.
          </Typography>
        </Box>

        <UsersFilters
          search={search}
          setSearch={setSearch}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          clearFilters={() => {
            setSearch("");
            setRoleFilter("all");
            setSortOrder("default");
          }}
        />
      </Box>

      <Card
        sx={{
          background: "linear-gradient(180deg,#252544,#1c1c32)",
          border: "1px solid rgba(255,255,255,.06)",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "2fr 2.5fr 1.5fr 1fr",
            },
            px: 3,
            py: 2,

            borderBottom: "1px solid rgba(255,255,255,.08)",

            color: "#9aa4c7",

            fontWeight: 700,
          }}
        >
          <Typography fontWeight={700}>User</Typography>

          <Typography fontWeight={700}>Email</Typography>

          <Typography fontWeight={700}>Role</Typography>

          <Typography fontWeight={700}>Actions</Typography>
        </Box>

        {isLoading ? (
          <Box p={3}>
            <Typography color="#888">Loading users...</Typography>
          </Box>
        ) : (
          paginatedUsers.map((user: User) => (
            <Box
              key={user.user_id}
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  md: "2fr 2.5fr 1.5fr 1fr",
                },

                px: 3,
                py: 2,
                alignItems: "center",
                borderBottom: "1px solid rgba(255,255,255,.05)",
                transition: "all .2s ease",

                "&:hover": {
                  background: "rgba(124,77,255,.08)",
                },
              }}
            >
              <Typography
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                {user.user_name}
              </Typography>

              <Typography
                sx={{
                  color: "#bbb",
                }}
              >
                {user.email}
              </Typography>

              <Typography
                sx={{
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 16,
                  textTransform: "capitalize",
                }}
              >
                {user.role}
              </Typography>

              <Box display="flex" gap={1}>
                <Button
                  startIcon={<LockResetIcon />}
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setSelectedUserId(user.user_id);
                    setResetDialogOpen(true);
                  }}
                  sx={{
                    color: "#a674fd",
                    fontWeight: 600,
                    textTransform: "none",
                    minWidth: "auto",
                  }}
                >
                  Reset
                </Button>

                <Button
                  startIcon={<DeleteOutlineIcon />}
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setSelectedUserId(user.user_id);
                    setDeleteDialogOpen(true);
                  }}
                  sx={{
                    fontWeight: 600,
                    textTransform: "none",
                    minWidth: "auto",

                    "&:hover": {
                      background: "rgba(255,107,107,.08)",
                    },
                  }}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          ))
        )}
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete User"
        message="Are you sure you want to delete this user?"
        confirmText="Delete"
        loadingText="Deleting..."
        onClose={() => setDeleteDialogOpen(false)}
        isLoading={deletingUser}
        onConfirm={async () => {
          try {
            if (selectedUserId) {
              await deleteUser(selectedUserId).unwrap();
            }

            setMessage("User deleted successfully");

            setSeverity("success");
            setOpenSnackbar(true);

            setDeleteDialogOpen(false);
          } catch {
            setMessage("Delete failed");
            setSeverity("error");
            setOpenSnackbar(true);
          }
        }}
      />

      <AppDialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        title=""
        fullWidth
        maxWidth="xs"
      >
        {selectedUserId && (
          <ResetUserPasswordForm
            userId={selectedUserId}
            onClose={() => setResetDialogOpen(false)}
          />
        )}
      </AppDialog>

      <AppSnackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        message={message}
        severity={severity}
      />

      <PaginationFooter
        page={page}
        totalPages={totalPages || 1}
        itemsPerPage={itemsPerPage}
        setPage={setPage}
        setItemsPerPage={setItemsPerPage}
        totalItems={totalItems}
        startItem={totalItems === 0 ? 0 : startIndex + 1}
        endItem={Math.min(startIndex + itemsPerPage, totalItems)}
        pageSizeOptions={[10, 15, 20, 25]}
      />
    </>
  );
}

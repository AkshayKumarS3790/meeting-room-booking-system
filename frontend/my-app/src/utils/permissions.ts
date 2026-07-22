import { getCurrentUser } from "./currentUser";

export const getPermissions = (): string[] => {
  return getCurrentUser()?.permissions ?? [];
};

export const hasPermission = (permission: string) => {
  return getPermissions().includes(permission);
};

export const canAddRoom = () => hasPermission("create_room");

export const canEditRoom = () => hasPermission("update_room");

export const canDeleteRoom = () => hasPermission("delete_room");

export const canEditAnyBooking = () => hasPermission("edit_any_booking");

export const canDeleteAnyBooking = () => hasPermission("delete_any_booking");

export const canViewUsers = () => hasPermission("view_users");

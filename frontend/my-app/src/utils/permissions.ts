import { getCurrentUser } from "./currentUser";

export const getPermissions = () => {
  return getCurrentUser()?.permissions ?? [];
};

export const hasPermission = (permission: string) => {
  return getPermissions().includes(permission);
};

// export const isAdmin = () => getCurrentUser()?.role === "admin";
// export const isManager = () => getCurrentUser()?.role === "manager";
// export const isEmployee = () => getCurrentUser()?.role === "employee";

export const canAddRoom = () => hasPermission("add_room");
export const canEditRoom = () => hasPermission("edit_room");
export const canDeleteRoom = () => hasPermission("delete_room");
export const canEditAnyBooking = () => hasPermission("edit_any_booking");
export const canDeleteAnyBooking = () => hasPermission("delete_any_booking");

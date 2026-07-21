export const hasPermission = (permissions: string[], permission: string) => {
  return permissions.includes(permission);
};

export const isAdmin = (role?: string) => role === "admin";

export const isManager = (role?: string) => role === "manager";

export const isEmployee = (role?: string) => role === "employee";

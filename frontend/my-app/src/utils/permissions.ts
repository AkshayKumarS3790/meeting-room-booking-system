export const getCurrentUser = () => {
  const user = localStorage.getItem("user");

  return user ? JSON.parse(user) : null;
};

export const hasPermission = (permission: string) => {
  const user = getCurrentUser();

  return user?.permissions?.includes(permission);
};

export const isAdmin = () => getCurrentUser()?.role === "admin";

export const isManager = () => getCurrentUser()?.role === "manager";

export const isEmployee = () => getCurrentUser()?.role === "employee";

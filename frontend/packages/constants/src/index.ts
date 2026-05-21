export const TOKEN_KEYS = {
  CLIENT: "token",
  ADMIN: "admin_token",
} as const;

export const ROLES = {
  USER: "user",
  ADMIN: "admin",
  EMPLOYEE: "employee",
} as const;

export const API_PATHS = {
  AUTH: "/auth",
  USER: "/user",
  ROLE: "/role",
  PERMISSION: "/permission",
} as const;

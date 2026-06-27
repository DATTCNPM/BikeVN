export const TOKEN_KEYS = {
  CLIENT: "client_token",
  PORTAL: "portal_token",
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

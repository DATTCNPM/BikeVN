export const TOKEN_KEYS = {
  CLIENT_ACCESS: "client_token",
  CLIENT_REFRESH: "client_refresh_token",

  PORTAL_ACCESS: "portal_token",
  PORTAL_REFRESH: "portal_refresh_token",
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

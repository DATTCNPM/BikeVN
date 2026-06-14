export const permissionKeys = {
  all: ["permissions"] as const,
  detail: (id: string) => ["permission", id] as const,
};

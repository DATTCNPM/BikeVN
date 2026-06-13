export const roleKeys = {
  all: ["roles"] as const,
  detail: (id: string) => ["role", id] as const,
};

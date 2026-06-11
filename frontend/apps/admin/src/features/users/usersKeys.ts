export const usersKeys = {
  all: ["users"] as const,
  detail: (id: string) => ["user", id] as const,
};

export const branchesKeys = {
  all: ["branches"] as const,
  detail: (id: string) => ["branch", id] as const,
};

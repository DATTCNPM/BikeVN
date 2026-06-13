export const employeeKeys = {
  all: ["employees"] as const,
  detail: (id: string) => ["employee", id] as const,
};

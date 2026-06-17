export const usersKeys = {
  all: ["users"] as const,
  lists: () => [...usersKeys.all, "list"] as const,
  list: (page: number, size: number) =>
    [...usersKeys.lists(), { page, size }] as const,
  detail: (id: string) => [...usersKeys.all, "detail", id] as const,
};

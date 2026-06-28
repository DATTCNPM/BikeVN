import type { UserQueryParams } from "node_modules/@repo/types/src/userType";

export const usersKeys = {
  all: ["users"] as const,
  lists: () => [...usersKeys.all, "list"] as const,
  list: (page: number, size: number) =>
    [...usersKeys.lists(), { page, size }] as const,
  filters: () => [...usersKeys.all, "filter"] as const,
  filter: (params?: UserQueryParams) =>
    [...usersKeys.filters(), { params }] as const,
  detail: (id: string) => [...usersKeys.all, "detail", id] as const,
};

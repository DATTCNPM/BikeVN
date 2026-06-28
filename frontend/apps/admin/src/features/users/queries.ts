import { useQuery } from "@tanstack/react-query";
import { userApi } from "@repo/api";
import { usersKeys } from "./usersKeys";
import type { PaginationResponse, User, UserQueryParams } from "@repo/types";

export function useUsers(page: number = 1, size: number = 10) {
  return useQuery<PaginationResponse<User>>({
    queryKey: usersKeys.list(page, size),
    queryFn: async () => {
      const response = await userApi.getUsers({ page, size });
      return response;
    },
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: async () => {
      const response = await userApi.getUserById(id);
      return response;
    },
    enabled: !!id,
  });
}

// Bộ lọc nâng cao (Khớp với API /users/filter)
export function useUserFilters(params?: UserQueryParams, enabled = true) {
  return useQuery<PaginationResponse<User>>({
    queryKey: usersKeys.filter(params),
    queryFn: async () => {
      const response = await userApi.getUserFilters(params);
      return response;
    },
    enabled: !!params && enabled,
  });
}

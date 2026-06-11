import { useQuery } from "@tanstack/react-query";
import { userApi } from "@repo/api";
import { usersKeys } from "./usersKeys";

export function useUsers(page: number = 1, size: number = 10) {
  return useQuery({
    queryKey: usersKeys.all,
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

import { useQuery } from "@tanstack/react-query";
import { userApi } from "@repo/api";

export const usersKeys = {
  all: ["users"] as const,
  detail: (id: string) => ["user", id] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: usersKeys.all,
    queryFn: async () => {
      const response = await userApi.getUsers();
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

import { useQuery } from "@tanstack/react-query";
import { userApi } from "@repo/api";

export const usersKeys = {
  all: ["users"] as const,
  detail: (id: string) => ["user", id] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: usersKeys.all,
    queryFn: () => userApi.getUsers(),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => userApi.getUserById(id),
    enabled: !!id,
  });
}

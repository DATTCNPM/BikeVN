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
      // Map cccdNumber to cccd_number if needed, and default roles to "user"
      const usersList = response?.result || [];
      return usersList.map((u) => ({
        ...u,
        cccd_number: u.cccdNumber,
        role: u.role || "user", // fallback display role
      }));
    },
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: async () => {
      const response = await userApi.getUserById(id);
      const user = response?.result;
      if (!user) return null;
      return {
        ...user,
        cccd_number: user.cccdNumber,
        role: user.role || "user",
      };
    },
    enabled: !!id,
  });
}

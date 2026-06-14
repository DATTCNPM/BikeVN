import { useQuery } from "@tanstack/react-query";
import { roleApi } from "@repo/api";
import { roleKeys } from "./roleKeys";

export function useRoles() {
  return useQuery({
    queryKey: roleKeys.all,
    queryFn: async () => {
      const response = await roleApi.getRoles();
      return response;
    },
  });
}

export function useRole(id: string) {
  return useQuery({
    queryKey: roleKeys.detail(id),
    queryFn: async () => {
      const response = await roleApi.getRoles(); // Assuming there's no specific endpoint for a single role, we fetch all and find the one we need
      return response.find((role) => role.id === id);
    },
    enabled: !!id,
  });
}

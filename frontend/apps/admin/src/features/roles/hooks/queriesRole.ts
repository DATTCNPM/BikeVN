import { useQuery } from "@tanstack/react-query";
import { roleApi } from "../api/roleApi";
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
      const response = await roleApi.getRoleById(id);
      return response;
    },
    enabled: !!id,
  });
}

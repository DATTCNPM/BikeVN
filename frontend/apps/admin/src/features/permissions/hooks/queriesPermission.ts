import { useQuery } from "@tanstack/react-query";
import { permissionApi } from "../api/permissionApi";
import { permissionKeys } from "./permissionKeys";

export function usePermissions() {
  return useQuery({
    queryKey: permissionKeys.all,
    queryFn: async () => {
      const response = await permissionApi.getPermissions();
      return response;
    },
  });
}

export function usePermission(id: string) {
  return useQuery({
    queryKey: permissionKeys.detail(id),
    queryFn: async () => {
      const response = await permissionApi.getPermissions(); // Assuming there's no specific endpoint for a single permission, we fetch all and find the one we need
      return response.find((permission) => permission.id === id);
    },
    enabled: !!id,
  });
}

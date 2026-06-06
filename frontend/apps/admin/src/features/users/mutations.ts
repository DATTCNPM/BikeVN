import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@repo/api";
import { usersKeys } from "./queries";
import type { UserCreationRequest, UpdateProfilePayload } from "@repo/types";

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UserCreationRequest) => userApi.createUser(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: usersKeys.all });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<UpdateProfilePayload>;
    }) => userApi.updateUser(id, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: usersKeys.all });
      await queryClient.invalidateQueries({
        queryKey: usersKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userApi.deleteUser(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: usersKeys.all });
    },
  });
}

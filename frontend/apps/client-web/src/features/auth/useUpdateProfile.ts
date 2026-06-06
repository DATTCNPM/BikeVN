import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userApi } from "@repo/api";

import type { UpdateProfilePayload } from "@repo/types";

import { authKeys } from "./authKeys";

import type { User } from "@repo/types";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      payload,
    }: {
      userId: string;
      payload: UpdateProfilePayload;
    }) => {
      const response = await userApi.updateUser(userId, payload);

      if (response?.code !== 1000 || !response.result) {
        throw new Error(response?.message || "Cập nhật thất bại");
      }

      return response.result;
    },

    onSuccess: (updatedUser: User) => {
      queryClient.setQueryData(authKeys.profile(), updatedUser);
    },
  });
};

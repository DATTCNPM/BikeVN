import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userClientApi } from "@repo/api";

import type { UpdateProfilePayload } from "@repo/types";

import { authKeys } from "../auth/authKeys";

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
      const response = await userClientApi.updateUser(userId, payload);

      return response;
    },

    onSuccess: (updatedUser: User) => {
      queryClient.setQueryData(authKeys.profile(), updatedUser);
    },
  });
};

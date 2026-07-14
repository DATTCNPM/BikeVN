import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userClientApi } from "@repo/api";
import { authKeys } from "@/features/auth/hooks/authKeys";
import type { User, UpdateProfilePayload } from "@repo/types";

interface UpdateProfileParams {
  userId: string;
  payload: UpdateProfilePayload;
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, payload }: UpdateProfileParams) => {
      return await userClientApi.updateUser(userId, payload);
    },
    onSuccess: (updatedUser: User) => {
      // Cập nhật trực tiếp dữ liệu profile trong cache mà không cần reload từ server
      queryClient.setQueryData(authKeys.profile(), updatedUser);
    },
  });
};

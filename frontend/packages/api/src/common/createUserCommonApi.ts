import type { AxiosInstance } from "axios";

import type { User, UpdateProfilePayload } from "@repo/types";

export const createUserCommonApi = (axiosInstance: AxiosInstance) => ({
  async updateUser(
    id: string,
    payload: Partial<UpdateProfilePayload> & { cccdNumber?: string },
  ) {
    const { cccdNumber, ...rest } = payload;
    const requestPayload = {
      ...rest,
      cccdNumber: cccdNumber || "",
    };
    return axiosInstance.put<User>(`/users/${id}`, requestPayload);
  },
});

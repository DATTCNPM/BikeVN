// src/apis/branchApi.ts
import type { Branch } from "@repo/types";
import axiosPublic from "../axios/axiosPublic";

export const branchPublicApi = {
  async getBranches() {
    const data = await axiosPublic.get<Branch[]>("/branch");
    console.log("Fetched branches:", data);
    return data || [];
  },

  async getBranchById(id: string) {
    const data = await axiosPublic.get<Branch>(
      `/branch/${id}`,
    );

    if (!data) {
      throw {
        response: {
          status: 404,
          data: {
            message: "Chi nhánh không tồn tại",
          },
        },
      };
    }

    return data;
  },
};

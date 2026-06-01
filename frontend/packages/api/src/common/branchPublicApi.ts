// src/apis/branchApi.ts
import type { Branch, ApiResponse } from "@repo/types";
import axiosPublic from "../axios/axiosPublic";

export const branchPublicApi = {
  async getBranches(): Promise<Branch[]> {
    const data = await axiosPublic.get<any, ApiResponse<Branch[]>>("/branch");
    console.log("Fetched branches:", data.result);
    return data.result || [];
  },

  async getBranchById(id: string): Promise<Branch> {
    const data = await axiosPublic.get<any, ApiResponse<Branch>>(
      `/branch/${id}`,
    );

    if (!data.result) {
      throw {
        response: {
          status: 404,
          data: {
            message: "Chi nhánh không tồn tại",
          },
        },
      };
    }

    return data.result;
  },
};

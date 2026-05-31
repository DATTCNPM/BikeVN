// src/apis/branchApi.ts
import type { Branch, BranchStatus, ApiResponse } from "@repo/types";
import axiosClient from "../axios/axiosClient";

export const branchApi = {
  async getBranches(): Promise<Branch[]> {
    const data = await axiosClient.get<any, ApiResponse<Branch[]>>("/branch");
    console.log("Fetched branches:", data.result);
    return data.result || [];
  },

  async getBranchById(id: string): Promise<Branch> {
    const data = await axiosClient.get<any, ApiResponse<Branch>>(
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

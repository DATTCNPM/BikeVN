// src/apis/branchApi.ts
import type { Branch, ApiResponse } from "@repo/types";
import axiosAdmin from "../axios/axiosAdmin";

import type { CreateBranchPayload, UpdateBranchPayload } from "@repo/types";

export const branchAdminApi = {
  async createBranch(
    payload: CreateBranchPayload,
  ): Promise<{ message: string; branch: Branch }> {
    const data = await axiosAdmin.post<any, ApiResponse<Branch>>(
      "/branch",
      payload,
    );
    console.log("Created branch with response:", data);

    return {
      message: "Tạo chi nhánh thành công",
      branch: data.result!,
    };
  },

  async updateBranch(
    id: string,
    payload: UpdateBranchPayload,
  ): Promise<{ message: string; branch: Branch }> {
    const data = await axiosAdmin.put<any, ApiResponse<Branch>>(
      `/branch/${id}`,
      payload,
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

    return {
      message: "Cập nhật chi nhánh thành công",
      branch: data.result,
    };
  },

  async deleteBranch(id: string): Promise<{ message: string }> {
    await axiosAdmin.delete(`/branch/${id}`);

    return {
      message: "Xóa chi nhánh thành công",
    };
  },
};

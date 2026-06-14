// src/apis/branchApi.ts
import type { Branch } from "@repo/types";
import axiosAdmin from "../axios/axiosAdmin";

import type { CreateBranchPayload, UpdateBranchPayload } from "@repo/types";

export const branchAdminApi = {
  async createBranch(payload: CreateBranchPayload) {
    const data = await axiosAdmin.post<Branch>("/branches", payload);

    return {
      message: "Tạo chi nhánh thành công",
      branch: data,
    };
  },

  async updateBranch(id: string, payload: UpdateBranchPayload) {
    const data = await axiosAdmin.put<Branch>(`/branches/${id}`, payload);

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

    return {
      message: "Cập nhật chi nhánh thành công",
      branch: data,
    };
  },

  async deleteBranch(id: string) {
    await axiosAdmin.delete(`/branches/${id}`);

    return {
      message: "Xóa chi nhánh thành công",
    };
  },
};

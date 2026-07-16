// src/apis/branchApi.ts
import { axiosAdmin } from "@/hooks/axiosAdmin";

import type {
  Branch,
  CreateBranchPayload,
  UpdateBranchPayload,
} from "@repo/types";

export const branchAdminApi = {
  async createBranch(payload: CreateBranchPayload) {
    const data = await axiosAdmin.post<Branch>("/branches", payload);
    return data;
  },

  async updateBranch(id: string, payload: UpdateBranchPayload) {
    const data = await axiosAdmin.put<Branch>(`/branches/${id}`, payload);
    return data;
  },

  async deleteBranch(id: string) {
    return await axiosAdmin.delete(`/branches/${id}`);
  },
};

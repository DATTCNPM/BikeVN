import type { Branch } from "@repo/schemas";
import axiosPublic from "../axios/axiosPublic";

export const branchPublicApi = {
  // Lấy toàn bộ danh sách chi nhánh công khai
  async getBranches(): Promise<Branch[]> {
    return axiosPublic.get<Branch[]>("/branches");
  },

  // Lấy thông tin chi tiết một chi nhánh qua ID
  async getBranchById(id: string): Promise<Branch> {
    return axiosPublic.get<Branch>(`/branches/${id}`);
  },
};

// src/apis/branchApi.ts
import type { Branch, BranchStatus, ApiResponse } from "@repo/types";
import axiosClient from "./axious";

export type CreateBranchPayload = {
  name: string;
  address: string;
  lat: number;
  lng: number;
  status?: BranchStatus;
};

export type UpdateBranchPayload = Partial<CreateBranchPayload>;

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

  async createBranch(
    payload: CreateBranchPayload,
  ): Promise<{ message: string; branch: Branch }> {
    const data = await axiosClient.post<any, ApiResponse<Branch>>(
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
    const data = await axiosClient.put<any, ApiResponse<Branch>>(
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
    await axiosClient.delete(`/branch/${id}`);

    return {
      message: "Xóa chi nhánh thành công",
    };
  },
};

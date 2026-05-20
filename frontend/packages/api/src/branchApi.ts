// src/apis/branchApi.ts

import { branches } from "./data/BranchData";

import type { Branch, BranchStatus } from "@repo/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
    await delay(500);

    return branches;
  },

  async getBranchById(id: string): Promise<Branch> {
    await delay(300);

    const branch = branches.find((b) => b.id === id);

    if (!branch) {
      throw {
        response: {
          status: 404,
          data: {
            message: "Chi nhánh không tồn tại",
          },
        },
      };
    }

    return branch;
  },

  async createBranch(
    payload: CreateBranchPayload,
  ): Promise<{ message: string; branch: Branch }> {
    await delay(500);

    const newBranch: Branch = {
      id: Date.now().toString(),

      name: payload.name,

      address: payload.address,

      lat: payload.lat,

      lng: payload.lng,

      status: payload.status || "active",

      created_at: new Date().toISOString(),
    };

    branches.push(newBranch);

    return {
      message: "Tạo chi nhánh thành công",

      branch: newBranch,
    };
  },

  async updateBranch(
    id: string,
    payload: UpdateBranchPayload,
  ): Promise<{ message: string; branch: Branch }> {
    await delay(500);

    const branchIndex = branches.findIndex((b) => b.id === id);

    if (branchIndex === -1) {
      throw {
        response: {
          status: 404,
          data: {
            message: "Chi nhánh không tồn tại",
          },
        },
      };
    }

    branches[branchIndex] = {
      ...branches[branchIndex],

      ...payload,
    };

    return {
      message: "Cập nhật chi nhánh thành công",

      branch: branches[branchIndex],
    };
  },

  async deleteBranch(id: string): Promise<{ message: string }> {
    await delay(500);

    const branchIndex = branches.findIndex((b) => b.id === id);

    if (branchIndex === -1) {
      throw {
        response: {
          status: 404,
          data: {
            message: "Chi nhánh không tồn tại",
          },
        },
      };
    }

    branches.splice(branchIndex, 1);

    return {
      message: "Xóa chi nhánh thành công",
    };
  },
};

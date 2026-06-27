// src/apis/branchApi.ts
import type { Branch } from "@repo/types";
import axiosPublic from "../axios/axiosPublic";

export const branchPublicApi = {
  async getBranches() {
    const data = await axiosPublic.get<Branch[], Branch[]>("/branches");
    return data;
  },

  async getBranchById(id: string) {
    const data = await axiosPublic.get<Branch, Branch>(`/branches/${id}`);

    return data;
  },
};

import { branches } from "../data/BranchData";
import type { Branch } from "@repo/types";

export const branchPublicApi = {
  async getBranches(): Promise<Branch[]> {
    return branches;
  },

  async getBranchById(id: string): Promise<Branch> {
    const branch = branches.find((b) => b.id === id);
    if (!branch) throw new Error("Branch not found in mock data");
    return branch;
  },
};

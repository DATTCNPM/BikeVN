// src/store/useBranchStore.ts

import { create } from "zustand";

import { devtools } from "zustand/middleware";

import {
  branchApi,
  type CreateBranchPayload,
  type UpdateBranchPayload,
} from "@/api/branchApi";

import type { Branch } from "@/lib/types";

interface BranchState {
  branches: Branch[];

  selectedBranch: Branch | null;

  loading: boolean;

  error: string | null;

  // Actions

  fetchBranches: () => Promise<void>;

  fetchBranchById: (id: string) => Promise<void>;

  createBranch: (payload: CreateBranchPayload) => Promise<boolean>;

  updateBranch: (id: string, payload: UpdateBranchPayload) => Promise<boolean>;

  deleteBranch: (id: string) => Promise<boolean>;

  clearSelectedBranch: () => void;

  setError: (message: string | null) => void;
}

export const useBranchStore = create<BranchState>()(
  devtools(
    (set) => ({
      // State

      branches: [],

      selectedBranch: null,

      loading: false,

      error: null,

      // Actions

      fetchBranches: async () => {
        set({
          loading: true,
          error: null,
        });

        try {
          const data = await branchApi.getBranches();

          set({
            branches: data,
          });
        } catch (err: any) {
          set({
            error:
              err.response?.data?.message || "Lấy danh sách chi nhánh thất bại",
          });
        } finally {
          set({
            loading: false,
          });
        }
      },

      fetchBranchById: async (id) => {
        set({
          loading: true,
          error: null,
        });

        try {
          const branch = await branchApi.getBranchById(id);

          set({
            selectedBranch: branch,
          });
        } catch (err: any) {
          set({
            error: err.response?.data?.message || "Không tìm thấy chi nhánh",
          });
        } finally {
          set({
            loading: false,
          });
        }
      },

      createBranch: async (payload: CreateBranchPayload) => {
        set({
          loading: true,
          error: null,
        });

        try {
          const response = await branchApi.createBranch(payload);

          set((state) => ({
            branches: [...state.branches, response.branch],
          }));

          return true;
        } catch (err: any) {
          set({
            error: err.response?.data?.message || "Tạo chi nhánh thất bại",
          });

          return false;
        } finally {
          set({
            loading: false,
          });
        }
      },

      updateBranch: async (id, payload) => {
        set({
          loading: true,
          error: null,
        });

        try {
          const response = await branchApi.updateBranch(id, payload);

          set((state) => ({
            branches: state.branches.map((branch) =>
              branch.id === id ? response.branch : branch,
            ),

            selectedBranch: response.branch,
          }));

          return true;
        } catch (err: any) {
          set({
            error: err.response?.data?.message || "Cập nhật chi nhánh thất bại",
          });

          return false;
        } finally {
          set({
            loading: false,
          });
        }
      },

      deleteBranch: async (id: string) => {
        set({
          loading: true,
          error: null,
        });

        try {
          await branchApi.deleteBranch(id);

          set((state) => ({
            branches: state.branches.filter((branch) => branch.id !== id),
          }));

          return true;
        } catch (err: any) {
          set({
            error: err.response?.data?.message || "Xóa chi nhánh thất bại",
          });

          return false;
        } finally {
          set({
            loading: false,
          });
        }
      },

      clearSelectedBranch: () => {
        set({
          selectedBranch: null,
        });
      },

      setError: (message) => {
        set({
          error: message,
        });
      },
    }),
    {
      name: "branch-store",
    },
  ),
);

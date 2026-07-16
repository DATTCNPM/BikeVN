import axiosClient from "@/hooks/axiosClient";
import { createUserCommonApi } from "@repo/api";

export const userClientApi = {
  ...createUserCommonApi(axiosClient),
};

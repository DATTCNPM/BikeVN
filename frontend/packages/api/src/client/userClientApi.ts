import axiosClient from "../axios/axiosClient";
import { createUserCommonApi } from "../common/createUserCommonApi";

export const userClientApi = {
  ...createUserCommonApi(axiosClient),
};

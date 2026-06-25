import axios from "axios";

import { ApiError } from "../error/ApiError";

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://bikevn.onrender.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosPublic.interceptors.response.use(
  (response) => {
    const data = response.data;

    /**
     * Success
     */
    if (data?.code === 1000) {
      return data.result;
    }

    /**
     * Business error
     */
    if (typeof data?.code === "number") {
      throw new ApiError(data.code, data.message || "Logic error");
    }

    /**
     * Fallback
     */
    return data;
  },
  (error) => Promise.reject(error),
);

export default axiosPublic;

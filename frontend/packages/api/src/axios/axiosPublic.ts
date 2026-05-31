import axios from "axios";

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

axiosPublic.interceptors.response.use(
  (response) => {
    const config = response.config as any;
    const data = response.data;

    if (config?.skipAuthCheck) {
      return data;
    }

    return data;
  },
  (error) => Promise.reject(error),
);

export default axiosPublic;

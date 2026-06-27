import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { ApiError } from "../error/ApiError";

// 1. Tạo instance nội bộ
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://bikevn.onrender.com",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

instance.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (data?.code === 1000) return data.result; // Trả về kết quả thô, không còn AxiosResponse
    if (typeof data?.code === "number") {
      throw new ApiError(data.code, data.message || "Logic error");
    }
    return data;
  },
  (error) => Promise.reject(error),
);

// 2. Định nghĩa lại các hàm gọi để trả về T thay vì AxiosResponse<T>
interface CustomAxiosInstance extends Omit<
  AxiosInstance,
  "get" | "post" | "put" | "delete"
> {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T>;
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

// 3. Export kèm ép kiểu custom
const axiosPublic = instance as CustomAxiosInstance;
export default axiosPublic;

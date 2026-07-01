// @repo/utils
import { differenceInDays, startOfDay } from "date-fns";

/**
 * 1. Hàm tính số ngày thuê xe (Tính theo số ngày trên lịch thực tế)
 */
export function calculateTotalDays(
  startDate: Date | string | null | undefined,
  endDate: Date | string | null | undefined,
): number {
  if (!startDate || !endDate) return 0;

  // Chuyển đổi an toàn dù đầu vào là chuỗi ISO string từ backend hay Object Date từ lịch UI
  const start = startOfDay(
    typeof startDate === "string" ? new Date(startDate) : startDate,
  );
  const end = startOfDay(
    typeof endDate === "string" ? new Date(endDate) : endDate,
  );

  // Áp dụng công thức (Ngày kết thúc - Ngày bắt đầu) + 1, tối thiểu là 1 ngày
  return Math.max(1, differenceInDays(end, start) + 1);
}

/**
 * 2. Hàm tính tổng số tiền dựa trên số ngày và giá xe
 */
export function calculateTotalPrice(
  totalDays: number,
  vehiclePrice: number | null | undefined,
): number {
  return totalDays * (vehiclePrice ?? 0);
}

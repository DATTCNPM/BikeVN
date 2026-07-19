import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/components/ui/chart";
import type { ChartConfig } from "@repo/ui/components/ui/chart";
import type { ChartDataResponse } from "@repo/types";

type Props = {
  data: ChartDataResponse[];
};

const chartConfig = {
  value: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

/**
 * Hàm định dạng tiền tệ tối ưu cho trục Y và Tooltip
 * Giúp sửa triệt để lỗi ép sai kiểu dữ liệu từ Backend (.000)
 */
const formatCurrency = (value: any) => {
  // Ép kiểu dữ liệu về dạng số để tránh lỗi chuỗi (string) từ backend
  const numericValue = Number(value) || 0;

  // Cấu hình hiển thị: Bạn chọn 1 trong 3 cách dưới đây bằng cách mở/khóa comment

  // CÁCH 1: Định dạng USD viết gọn (Ví dụ: $1K, $25K, $1.5M) -> Khuyên dùng cho biểu đồ
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    style: "currency",
    currency: "VND",
  }).format(numericValue);

  /*
  // CÁCH 2: Định dạng USD đầy đủ nhưng không lấy phần thập phân (Ví dụ: $1,500, $50,000)
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericValue);
  */

  /*
  // CÁCH 3: Định dạng tiếng Việt nếu backend trả về đơn vị Đồng (Ví dụ: 10 tr, 1 tỷ hoặc 10.000.000 ₫)
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    notation: "compact", // Bỏ dòng này nếu muốn hiển thị đầy đủ số 0
  }).format(numericValue);
  */
};

export default function RevenueChart({ data }: Props) {
  // Tránh crash ứng dụng nếu dữ liệu chưa kịp tải hoặc trống
  if (!data || data.length === 0) {
    return (
      <Card className="rounded-3xl border-muted/50">
        <CardHeader>
          <CardTitle className="text-xl font-bold tracking-tight">
            Monthly Revenue
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[320px] flex items-center justify-center text-muted-foreground">
          No data available
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl shadow-sm border-muted/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold tracking-tight text-foreground">
          Monthly Revenue
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[320px] relative min-b-0">
          <ChartContainer
            config={chartConfig}
            className="absolute inset-0 h-full w-full"
          >
            {/* Đã chỉnh margin left: 0 và bổ sung width ở trục Y 
              để đảm bảo không bao giờ bị cắt chữ/mất ký tự tiền tệ 
            */}
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                {/* Hiệu ứng Gradient chuyển màu mờ dần hiện đại */}
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.25}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              {/* Đường lưới nét đứt tinh tế, tiệp màu hệ thống */}
              <CartesianGrid
                vertical={false}
                stroke="var(--border)"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                className="text-xs font-medium fill-muted-foreground"
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                width={65} // Tạo không gian cố định 65px cho trục Y hiển thị đẹp mắt
                className="text-xs font-medium fill-muted-foreground"
                tickFormatter={formatCurrency}
              />

              <ChartTooltip
                cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value) => formatCurrency(value)} // Định dạng tiền ngay trong tooltip khi hover
                  />
                }
              />

              <Area
                type="monotone"
                dataKey="value"
                fill="url(#fillRevenue)"
                stroke="var(--chart-1)"
                strokeWidth={2.5}
                // Hiệu ứng chấm tròn động khi tương tác chuột
                activeDot={{
                  r: 6,
                  style: { fill: "var(--chart-1)", opacity: 0.9 },
                }}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

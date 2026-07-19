import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
    label: "Revenue by Branch",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

/**
 * Định dạng tiền tệ rút gọn cho doanh thu chi nhánh (Ví dụ: $10K, $1.2M hoặc định dạng VND)
 */
const formatCurrency = (value: any) => {
  const numericValue = Number(value) || 0;

  // Bạn có thể đổi sang "vi-VN" và "VND" nếu cần hiển thị tiền Việt nhé
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    style: "currency",
    currency: "USD",
  }).format(numericValue);
};

export default function BranchPerformanceChart({ data }: Props) {
  // Phòng hờ trường hợp API chưa trả dữ liệu hoặc mảng rỗng
  if (!data || data.length === 0) {
    return (
      <Card className="rounded-3xl border-muted/50">
        <CardHeader>
          <CardTitle className="text-xl font-bold tracking-tight">
            Branch Performance
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
          Branch Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Đã loại bỏ bớt bọc <ResponsiveContainer> thừa bên trong này */}
        <div className="w-full h-[320px] relative min-h-[320px]">
          <ChartContainer
            config={chartConfig}
            className="absolute inset-0 h-full w-full"
          >
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              {/* Đường lưới nét đứt tinh tế */}
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
                width={65} // Giữ khoảng trống 65px an toàn để trục Y không bị che chữ
                className="text-xs font-medium fill-muted-foreground"
                tickFormatter={formatCurrency}
              />

              <ChartTooltip
                cursor={{ fill: "var(--muted)", opacity: 0.15 }} // Tạo hiệu ứng highlight vùng cột khi hover
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value) => formatCurrency(value)} // Đồng bộ định dạng tiền tệ trong tooltip
                  />
                }
              />

              <Bar
                dataKey="value"
                fill="var(--chart-2)"
                radius={[6, 6, 0, 0]} // Bo góc nhẹ phần đỉnh cột nhìn sẽ hiện đại, mượt mà hơn
                maxBarSize={50} // Giới hạn độ rộng tối đa của cột để tránh bị quá to khi có ít chi nhánh
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

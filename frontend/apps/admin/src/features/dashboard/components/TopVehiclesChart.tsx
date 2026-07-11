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
    label: "Rentals",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

/**
 * Định dạng số lượt thuê (Ví dụ: 12500 -> 12,500 hoặc 12.5K tùy số lượng lớn hay nhỏ)
 */
const formatNumber = (value: any) => {
  const numericValue = Number(value) || 0;
  return new Intl.NumberFormat("en-US").format(numericValue);
};

export default function TopVehiclesChart({ data }: Props) {
  // Phòng hờ trường hợp dữ liệu trống
  if (!data || data.length === 0) {
    return (
      <Card className="rounded-3xl border-muted/50">
        <CardHeader>
          <CardTitle className="text-xl font-bold tracking-tight">
            Popular Vehicles
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
          Popular Vehicles
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Loại bỏ ResponsiveContainer dư thừa */}
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          {/* Chỉnh margin để phần text bên trái và số bên phải không sát viền */}
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            {/* Lưới dọc nét đứt nhẹ nhàng */}
            <CartesianGrid
              horizontal={false}
              stroke="var(--border)"
              strokeDasharray="3 3"
            />

            {/* Trục X đóng vai trò là Trục số (Rentals) */}
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs font-medium fill-muted-foreground"
              tickFormatter={formatNumber}
            />

            {/* Trục Y đóng vai trò là danh mục (Tên xe) */}
            <YAxis
              dataKey="label"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              width={130} // Tăng từ 120 lên 130px để có thêm khoảng trống cho tên xe dài
              className="text-xs font-medium fill-foreground" // Chuyển sang fill-foreground cho tên xe rõ nét hơn
            />

            <ChartTooltip
              cursor={{ fill: "var(--muted)", opacity: 0.15 }} // Highlight vùng dòng khi hover chuột
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value) => [
                    `${formatNumber(value)} rentals`,
                    "Rentals",
                  ]}
                />
              }
            />

            <Bar
              dataKey="value"
              fill="var(--chart-3)"
              radius={[0, 6, 6, 0]} // Bo tròn 2 góc phía bên phải của thanh ngang
              maxBarSize={24} // Giới hạn thanh ngang thanh mảnh, sang xịn mịn (không bị phình to)
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

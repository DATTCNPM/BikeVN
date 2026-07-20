import { useEffect, useState } from "react";
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
import type { ChartDataResponse } from "@repo/schemas";

type Props = {
  data: ChartDataResponse[];
};

const chartConfig = {
  value: {
    label: "Revenue by Branch",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const formatCurrency = (value: any) => {
  const numericValue = Number(value) || 0;
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    style: "currency",
    currency: "USD",
  }).format(numericValue);
};

export default function BranchPerformanceChart({ data }: Props) {
  // 1. Thêm state kiểm tra Môi trường Client đã Mount chưa
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

      <CardContent className="h-[320px] w-full p-6 pt-0">
        {/* 2. Chỉ render ChartContainer khi Client đã Mount hoàn tất */}
        {isMounted ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-full w-full"
          >
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
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
                width={65}
                className="text-xs font-medium fill-muted-foreground"
                tickFormatter={formatCurrency}
              />

              <ChartTooltip
                cursor={{ fill: "var(--muted)", opacity: 0.15 }}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value) => formatCurrency(value)}
                  />
                }
              />

              <Bar
                dataKey="value"
                fill="var(--chart-2)"
                radius={[6, 6, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          // Placeholder hiển thị tạm trong lúc SSR/Hydrate trên Vercel
          <div className="h-full w-full bg-muted/10 animate-pulse rounded-lg" />
        )}
      </CardContent>
    </Card>
  );
}

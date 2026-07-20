import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
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
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const formatCurrency = (value: any) => {
  const numericValue = Number(value) || 0;
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    style: "currency",
    currency: "VND",
  }).format(numericValue);
};

export default function RevenueChart({ data }: Props) {
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

      {/* Sửa: Đặt h-[320px] cố định ở CardContent */}
      <CardContent className="h-[320px] w-full p-6 pt-0">
        {/* Sửa: Thêm h-full w-full aspect-auto */}
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            minHeight={0}
          >
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
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
                cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value) => formatCurrency(value)}
                  />
                }
              />

              <Area
                type="monotone"
                dataKey="value"
                fill="url(#fillRevenue)"
                stroke="var(--chart-1)"
                strokeWidth={2.5}
                activeDot={{
                  r: 6,
                  style: { fill: "var(--chart-1)", opacity: 0.9 },
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

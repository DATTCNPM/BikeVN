import {
  Bar,
  BarChart,
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
    label: "Rentals",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const formatNumber = (value: any) => {
  const numericValue = Number(value) || 0;
  return new Intl.NumberFormat("en-US").format(numericValue);
};

export default function TopVehiclesChart({ data }: Props) {
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
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid
                horizontal={false}
                stroke="var(--border)"
                strokeDasharray="3 3"
              />

              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs font-medium fill-muted-foreground"
                tickFormatter={formatNumber}
              />

              <YAxis
                dataKey="label"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                width={130}
                className="text-xs font-medium fill-foreground"
              />

              <ChartTooltip
                cursor={{ fill: "var(--muted)", opacity: 0.15 }}
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
                radius={[0, 6, 6, 0]}
                maxBarSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

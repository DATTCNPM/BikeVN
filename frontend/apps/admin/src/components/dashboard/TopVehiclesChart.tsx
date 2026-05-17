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
  type ChartConfig,
} from "@repo/ui/components/ui/chart";

import type { DashboardOverview } from "@repo/types";

type Props = {
  data: DashboardOverview["charts"]["topVehicles"];
};

const chartConfig = {
  total: {
    label: "Số lượt thuê",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function TopVehiclesChart({ data }: Props) {
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Xe được thuê nhiều nhất</CardTitle>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={data}>
              <CartesianGrid horizontal={false} />

              <XAxis type="number" />

              <YAxis dataKey="vehicle" type="category" width={100} />

              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

              <Bar
                dataKey="total"
                radius={[0, 12, 12, 0]}
                fill="var(--chart-1)"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

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
  data: DashboardOverview["charts"]["branchPerformance"];
};

const chartConfig = {
  bookings: {
    label: "Number of Bookings",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function BranchPerformanceChart({ data }: Props) {
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Branch Performance</CardTitle>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid vertical={false} />

              <XAxis dataKey="branch" />

              <YAxis />

              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

              <Bar
                dataKey="bookings"
                radius={[12, 12, 0, 0]}
                fill="var(--chart-1)"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

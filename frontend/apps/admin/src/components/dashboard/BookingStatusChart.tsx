import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";

import type { DashboardOverview } from "@repo/types";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@repo/ui/components/ui/chart";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

type Props = {
  data: DashboardOverview["charts"]["bookingStatus"];
};

const chartConfig = {
  completed: {
    label: "Đã hoàn thành",
    color: "var(--chart-1)",
  },
  cancelled: {
    label: "Đã hủy",
    color: "var(--chart-2)",
  },
  pending: {
    label: "Đang chờ",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export default function BookingStatusChart({ data }: Props) {
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Trạng thái đơn thuê</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[320px]">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  label
                >
                  {data.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

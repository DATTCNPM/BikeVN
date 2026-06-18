import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

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

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"];

type Props = {
  data: DashboardOverview["charts"]["vehicleStatus"];
};

const chartConfig = {
  available: {
    label: "Available",
    color: "var(--chart-1)",
  },
  rented: {
    label: "Rented",
    color: "var(--chart-2)",
  },
  maintenance: {
    label: "Maintenance",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export default function VehicleStatusChart({ data }: Props) {
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Vehicle Status</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[320px]">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}
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

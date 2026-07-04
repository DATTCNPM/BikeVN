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
import type { ChartDataResponse } from "@repo/types";

type Props = {
  data: ChartDataResponse[];
};

const chartConfig = {
  value: {
    label: "Rentals",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export default function TopVehiclesChart({ data }: Props) {
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Popular Vehicles</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={data}>
              <CartesianGrid horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="label" type="category" width={120} />{" "}
              {/* Tên xe nằm ở 'label' */}
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar
                dataKey="value"
                radius={[0, 12, 12, 0]}
                fill="var(--chart-3)"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

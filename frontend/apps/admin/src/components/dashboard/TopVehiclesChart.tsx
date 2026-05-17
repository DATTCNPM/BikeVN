import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";

import type { DashboardOverview } from "@repo/types";

type Props = {
  data: DashboardOverview["charts"]["topVehicles"];
};

export default function TopVehiclesChart({ data }: Props) {
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Xe được thuê nhiều nhất</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={data}>
              <CartesianGrid horizontal={false} />

              <XAxis type="number" />

              <YAxis dataKey="vehicle" type="category" width={100} />

              <Tooltip />

              <Bar
                dataKey="total"
                radius={[0, 12, 12, 0]}
                fill="currentColor"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

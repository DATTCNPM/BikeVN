import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";

import type { DashboardOverview } from "@repo/types";

type Props = {
  data: DashboardOverview["recentBookings"];
};

export default function RecentBookingsTable({ data }: Props) {
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>

                <TableCell>{booking.user}</TableCell>

                <TableCell>{booking.vehicle}</TableCell>

                <TableCell>{booking.total}</TableCell>

                <TableCell>{booking.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

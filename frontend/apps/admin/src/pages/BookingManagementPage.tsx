import { useMemo, useState } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import TableActionDropdown from "@/components/common/TableActionDropdown";
import TablePagination from "@/components/common/TablePagination";

import { Badge } from "@repo/ui/components/ui/badge";

type BookingStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "completed"
  | "cancelled";

type Booking = {
  id: number;
  customer: string;
  vehicle: string;
  pickup_branch: string;
  return_branch: string;
  start_time: string;
  end_time: string;
  total_price: number;
  status: BookingStatus;
};

const bookings: Booking[] = [
  {
    id: 1,
    customer: "Nguyễn Văn A",
    vehicle: "Honda Vision",
    pickup_branch: "Cà Mau",
    return_branch: "Năm Căn",
    start_time: "2026-05-14 08:00",
    end_time: "2026-05-16 08:00",
    total_price: 300000,
    status: "approved",
  },
];

const bookingStatusMap = {
  pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300",

  approved: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",

  rejected: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",

  completed:
    "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",

  cancelled: "bg-zinc-200 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-300",
};

export default function BookingManagementPage() {
  const [search, setSearch] = useState("");

  const columns = useMemo<ColumnDef<Booking>[]>(
    () => [
      {
        accessorKey: "customer",
        header: "Khách hàng",
      },

      {
        accessorKey: "vehicle",
        header: "Xe",
      },

      {
        accessorKey: "pickup_branch",
        header: "Chi nhánh nhận",
      },

      {
        accessorKey: "return_branch",
        header: "Chi nhánh trả",
      },

      {
        accessorKey: "start_time",
        header: "Bắt đầu",
      },

      {
        accessorKey: "end_time",
        header: "Kết thúc",
      },

      {
        accessorKey: "total_price",
        header: "Tổng tiền",

        cell: ({ row }) => `${row.original.total_price.toLocaleString()}đ`,
      },

      {
        accessorKey: "status",
        header: "Trạng thái",

        cell: ({ row }) => (
          <Badge className={bookingStatusMap[row.original.status]}>
            {row.original.status}
          </Badge>
        ),
      },

      {
        id: "actions",

        header: "",

        cell: () => (
          <TableActionDropdown
            onEdit={() => console.log("edit")}
            onDelete={() => console.log("delete")}
          />
        ),
      },
    ],
    [],
  );

  return (
    <div>
      <DataTableToolbar
        search={search}
        onSearchChange={setSearch}
        onCreate={() => console.log("create")}
      />

      <DataTable columns={columns} data={bookings} />

      <TablePagination
        page={1}
        totalPages={10}
        onPageChange={(page) => console.log(page)}
      />
    </div>
  );
}

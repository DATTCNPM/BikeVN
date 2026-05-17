import { useMemo, useState } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import TableActionDropdown from "@/components/common/TableActionDropdown";
import TablePagination from "@/components/common/TablePagination";

import { Badge } from "@repo/ui/components/ui/badge";

type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

type PaymentType = "deposit" | "rental";

type Payment = {
  id: number;
  booking_id: number;
  amount: number;
  type: PaymentType;
  payment_method: string;
  status: PaymentStatus;
  transaction_code: string | null;
  paid_at: string | null;
};

const payments: Payment[] = [
  {
    id: 1,
    booking_id: 12,
    amount: 500000,
    type: "deposit",
    payment_method: "Momo",
    status: "completed",
    transaction_code: "MOMO_123456",
    paid_at: "2026-05-14 10:30",
  },
];

const paymentStatusMap = {
  pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300",

  completed:
    "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",

  failed: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",

  refunded: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
};

export default function PaymentManagementPage() {
  const [search, setSearch] = useState("");

  const columns = useMemo<ColumnDef<Payment>[]>(
    () => [
      {
        accessorKey: "booking_id",
        header: "Mã đơn",
      },

      {
        accessorKey: "amount",
        header: "Số tiền",

        cell: ({ row }) => `${row.original.amount.toLocaleString()}đ`,
      },

      {
        accessorKey: "type",
        header: "Loại thanh toán",

        cell: ({ row }) => (
          <Badge variant="secondary">{row.original.type}</Badge>
        ),
      },

      {
        accessorKey: "payment_method",
        header: "Phương thức",
      },

      {
        accessorKey: "status",
        header: "Trạng thái",

        cell: ({ row }) => (
          <Badge className={paymentStatusMap[row.original.status]}>
            {row.original.status}
          </Badge>
        ),
      },

      {
        accessorKey: "transaction_code",
        header: "Mã giao dịch",
      },

      {
        accessorKey: "paid_at",
        header: "Thời gian thanh toán",

        cell: ({ row }) => row.original.paid_at || "--",
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

      <DataTable columns={columns} data={payments} />

      <TablePagination
        page={1}
        totalPages={5}
        onPageChange={(page) => console.log(page)}
      />
    </div>
  );
}

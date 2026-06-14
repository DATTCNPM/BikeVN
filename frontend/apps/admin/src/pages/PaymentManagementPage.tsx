import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import PaymentActionDropdown from "@/features/payments/components/PaymentActionDropdown";
import PaymentStatusDialog from "@/features/payments/components/PaymentStatusDialog";
import TablePagination from "@/components/common/TablePagination";

import { Badge } from "@repo/ui/components/ui/badge";
import { Spinner } from "@repo/ui/components/ui/spinner";

import { usePayments } from "@/features/payments/queries";

import type { Payment, PaymentStatus, PaymentType } from "@repo/types";

const paymentStatusMap: Record<PaymentStatus, string> = {
  pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300",

  completed:
    "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",

  failed: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
};

const paymentStatusLabel: Record<PaymentStatus, string> = {
  pending: "Chờ xử lý",
  completed: "Hoàn thành",
  failed: "Thất bại",
};

const paymentTypeLabel: Record<PaymentType, string> = {
  rental: "Thanh toán thuê xe",
  extra_fee: "Phí phát sinh",
};

export default function PaymentManagementPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const [dialogMode, setDialogMode] = useState<
    "confirm" | "approve-manually" | "cancel" | null
  >(null);
  const params = {
    search,
    page,
    pageSize: 10,
  };

  const { data: payments, isLoading } = usePayments(params);

  const paymentData = payments?.data || [];
  const pagination = {
    page: payments?.pageCurrent || 1,
    pageSize: payments?.pageSize || 10,
    totalPages: payments?.totalPages || 1,
    totalElements: payments?.totalElements || 0,
  };
  const columns = useMemo<ColumnDef<Payment>[]>(
    () => [
      {
        accessorKey: "bookingId",
        header: "Mã đơn",
        cell: ({ row }) => (
          <span className="font-medium">
            #{row.original.bookingId.slice(0, 8)}
          </span>
        ),
      },

      {
        accessorKey: "amount",
        header: "Số tiền",
        cell: ({ row }) => `${row.original.amount.toLocaleString("vi-VN")} đ`,
      },

      {
        accessorKey: "type",
        header: "Loại",
        cell: ({ row }) => (
          <Badge variant="secondary">
            {paymentTypeLabel[row.original.type as PaymentType] ??
              row.original.type}
          </Badge>
        ),
      },

      {
        accessorKey: "paymentMethod",
        header: "Phương thức",
      },

      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => (
          <Badge
            className={paymentStatusMap[row.original.status as PaymentStatus]}
          >
            {paymentStatusLabel[row.original.status as PaymentStatus] ??
              row.original.status}
          </Badge>
        ),
      },

      {
        accessorKey: "createdAt",
        header: "Ngày tạo",
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleString("vi-VN"),
      },

      {
        id: "actions",
        header: "",

        cell: ({ row }) => {
          const payment = row.original;

          // if (payment.status !== "failed") {
          //   return null;
          // }

          return (
            <PaymentActionDropdown
              onConfirm={() => {
                setSelectedPayment(payment);
                setDialogMode("confirm");
              }}
              onApproveManually={() => {
                setSelectedPayment(payment);
                setDialogMode("approve-manually");
              }}
              onCancel={() => {
                setSelectedPayment(payment);
                setDialogMode("cancel");
              }}
            />
          );
        },
      },
    ],
    [],
  );

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  console.log("Payments:", payments);

  return (
    <div className="space-y-4">
      <DataTableToolbar search={search} onSearchChange={setSearch} />

      <DataTable columns={columns} data={paymentData} />

      <PaymentStatusDialog
        payment={selectedPayment}
        open={!!selectedPayment && dialogMode !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedPayment(null);
            setDialogMode(null);
          }
        }}
        mode={dialogMode ?? "confirm"}
      />
      <TablePagination
        page={pagination.page || 1}
        pageSize={pagination.pageSize || 10}
        totalPages={pagination.totalPages || 1}
        totalElements={pagination.totalElements || 0}
        onPageChange={(page) => {
          setPage(page);
        }}
      />
    </div>
  );
}

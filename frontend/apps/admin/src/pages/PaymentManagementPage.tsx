import { useMemo, useState, useEffect } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import TableActionDropdown from "@/components/common/TableActionDropdown";
import TablePagination from "@/components/common/TablePagination";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { toast } from "@repo/ui/components/ui/sonner";

import { Badge } from "@repo/ui/components/ui/badge";

// import PaymentCreate from "@/components/payment/PaymentCreate";
// import PaymentEdit from "@/components/payment/PaymentEdit";
// import PaymentDelete from "@/components/payment/PaymentDelete";

import { usePayments } from "@/features/payments/queries";
import type { Payment } from "@repo/types";

const paymentStatusMap = {
  pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300",
  completed:
    "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
  failed: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  refunded: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
};

const paymentStatusLabel = {
  pending: "Chờ xử lý",
  completed: "Hoàn thành",
  failed: "Thất bại",
  refunded: "Đã hoàn tiền",
};

const paymentTypeLabel = {
  deposit: "Đặt cọc",
  rental: "Thuê xe",
};

export default function PaymentManagementPage() {
  const { data: payments = [], isLoading, error } = usePayments();

  // const [openCreateDialog, setOpenCreateDialog] = useState(false);
  // const [openEditDialog, setOpenEditDialog] = useState(false);
  // const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  // const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (error) {
      toast.error("Không thể tải danh sách thanh toán");
    }
  }, [error]);

  const columns = useMemo<ColumnDef<Payment>[]>(
    () => [
      {
        accessorKey: "bookingId",
        header: "Mã đơn",
        cell: ({ row }) => (
          <span className="text-sm font-medium">
            #{row.original.bookingId.substring(0, 6)}
          </span>
        ),
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
          <Badge variant="secondary">
            {paymentTypeLabel[row.original.type] || row.original.type}
          </Badge>
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
            {paymentStatusLabel[row.original.status] || row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: "transaction_code",
        header: "Mã giao dịch",
        cell: ({ row }) => row.original.transaction_code || "--",
      },
      {
        accessorKey: "paid_at",
        header: "Thời gian TT",
        cell: ({ row }) =>
          row.original.paid_at
            ? new Date(row.original.paid_at).toLocaleString("vi-VN")
            : "--",
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <TableActionDropdown
            onEdit={() => {
              setSelectedPayment(row.original);
              setOpenEditDialog(true);
            }}
            onDelete={() => {
              setSelectedPayment(row.original);
              setOpenDeleteDialog(true);
            }}
          />
        ),
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

  return (
    <div>
      <DataTableToolbar
        search={search}
        onSearchChange={setSearch}
        onCreateOpen={() => setOpenCreateDialog(true)}
      />

      <DataTable columns={columns} data={payments} />

      <TablePagination
        page={1}
        totalPages={Math.ceil(payments.length / 10) || 1}
        onPageChange={(page) => console.log(page)}
      />

      {/* <PaymentCreate
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
      />
      <PaymentEdit
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        payment={selectedPayment}
      />
      <PaymentDelete
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        payment={selectedPayment}
      /> */}
    </div>
  );
}

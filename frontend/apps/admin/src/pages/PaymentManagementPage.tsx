import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import PaymentActionDropdown from "@/features/payments/components/PaymentActionDropdown";
import PaymentStatusDialog from "@/features/payments/components/PaymentStatusDialog";
import TablePagination from "@/components/common/TablePagination";
import PaymentInfoPopover from "@/features/payments/components/PaymentInfoPopover";
import { IdCell } from "@/components/common/IdCell";

import { Badge } from "@repo/ui/components/ui/badge";
import { Spinner } from "@repo/ui/components/ui/spinner";
import UniversalFilterSheet, {
  type FilterConfigItem,
} from "@repo/ui/components/wrapper/UniversalFilterSheet";

import { usePayments } from "@/features/payments/queries";
import { useBranches } from "@repo/hooks"; // Sử dụng để lấy danh sách chi nhánh giống bên User

import type {
  Payment,
  PaymentStatus,
  PaymentType,
  PaymentFilterParams,
} from "@repo/types";

const paymentStatusMap: Record<PaymentStatus, string> = {
  pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300",
  completed:
    "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
  failed: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  refunded: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
};

const paymentStatusLabel: Record<PaymentStatus, string> = {
  pending: "Pending",
  completed: "Completed",
  failed: "Failed",
  refunded: "Refunded",
};

const paymentTypeLabel: Record<PaymentType, string> = {
  rental: "Rental Payment",
  extra_fee: "Extra Fee",
  unspecified: "Unspecified",
};

export default function PaymentManagementPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(""); // Ô search chung đại diện cho `bookingId` hoặc `transactionCode`

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [dialogMode, setDialogMode] = useState<
    "confirm" | "approve-manually" | "cancel" | null
  >(null);

  // 1. Quản lý trạng thái bộ lọc nâng cao trên UI
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>(
    {},
  );

  // 2. Fetch danh sách chi nhánh hỗ trợ bộ lọc
  const { data: branches } = useBranches();

  // 3. Cấu hình hiển thị cho UniversalFilterSheet dựa trên Payment Schema
  const filterConfigs = useMemo<FilterConfigItem[]>(() => {
    return [
      {
        key: "branchId",
        title: "Branch",
        options: branches?.map((b) => ({ label: b.name, value: b.id })) ?? [],
      },
      {
        key: "status",
        title: "Status",
        options: [
          { label: "Pending", value: "pending" },
          { label: "Completed", value: "completed" },
          { label: "Failed", value: "failed" },
          { label: "Refunded", value: "refunded" },
        ],
      },
      {
        key: "type",
        title: "Type",
        options: [
          { label: "Rental Payment", value: "rental" },
          { label: "Extra Fee", value: "extra_fee" },
          { label: "Unspecified", value: "unspecified" },
        ],
      },
      // Lưu ý: Đối với From Date / To Date nếu UniversalFilterSheet chưa hỗ trợ input dạng date,
      // bạn có thể tạm bổ sung text hoặc xử lý riêng, ở đây config đại diện text/select mẫu.
    ];
  }, [branches]);

  // 4. Ánh xạ các giá trị state thành Query Params gửi lên API của `usePayments`
  const apiParams = useMemo<PaymentFilterParams>(() => {
    const trimmedSearch = search.trim();

    return {
      // Phân bổ ô search chung vào cả bookingId hoặc transactionCode tùy thuộc thiết kế API BE
      bookingId: trimmedSearch || undefined,
      transactionCode: trimmedSearch || undefined,
      branchId: selectedFilters["branchId"]?.value,
      status: selectedFilters["status"]?.value as PaymentStatus,
      type: selectedFilters["type"]?.value as PaymentType,
      page,
      size: 10, // Đồng bộ với schema BE dùng `size` thay vì `pageSize`
    };
  }, [search, selectedFilters, page]);

  // 5. Fetch dữ liệu từ API
  const { data: paymentsResponse, isLoading } = usePayments(apiParams);

  const paymentData = paymentsResponse?.data || [];

  const pagination = {
    page: paymentsResponse?.currentPage || 1,
    pageSize: paymentsResponse?.pageSize || 10,
    totalPages: paymentsResponse?.totalPages || 1,
    totalElements: paymentsResponse?.totalElements || 0,
  };

  const columns = useMemo<ColumnDef<Payment>[]>(
    () => [
      {
        accessorKey: "bookingId",
        header: "Booking ID",
        cell: ({ row }) => (
          <span className="font-medium">
            <IdCell id={row.original.bookingId} prefix="#" />
          </span>
        ),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => `${row.original.amount.toLocaleString("vi-VN")} đ`,
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <Badge variant="secondary">
            {paymentTypeLabel[row.original.type as PaymentType] ??
              row.original.type}
          </Badge>
        ),
      },
      {
        accessorKey: "paymentMethod",
        header: "Payment Method",
      },
      {
        accessorKey: "status",
        header: "Status",
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
        accessorKey: "paidAt",
        header: "Paid At",
        cell: ({ row }) =>
          row.original.paidAt
            ? new Date(row.original.paidAt).toLocaleString("vi-VN")
            : "-",
      },
      {
        id: "info",
        header: "",
        cell: ({ row }) => <PaymentInfoPopover payment={row.original} />,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const payment = row.original;
          if (payment.status === "completed") return null;

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

  return (
    <div className="space-y-4">
      {/* 6. Tích hợp UniversalFilterSheet vào DataTableToolbar */}
      <DataTableToolbar
        showSearch={true}
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
      >
        <UniversalFilterSheet
          title="Filter Payments"
          configs={filterConfigs}
          value={selectedFilters}
          onChange={(newFilters) => {
            setSelectedFilters(newFilters);
            setPage(1);
          }}
          onReset={() => {
            setSearch("");
            setSelectedFilters({});
            setPage(1);
          }}
        />
      </DataTableToolbar>

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
        page={pagination.page}
        pageSize={pagination.pageSize}
        totalPages={pagination.totalPages}
        totalElements={pagination.totalElements}
        onPageChange={setPage}
      />
    </div>
  );
}

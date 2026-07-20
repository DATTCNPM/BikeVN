import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
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

import {
  usePayments,
  usePaymentsByBranch,
} from "@/features/payments/hooks/queries";
import { useBranches } from "@repo/hooks";

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
  processing_refund:
    "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
  refunded: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
};

const paymentStatusLabel: Record<PaymentStatus, string> = {
  pending: "Pending",
  completed: "Completed",
  failed: "Failed",
  processing_refund: "Processing Refund",
  refunded: "Refunded",
};

const paymentTypeLabel: Record<PaymentType, string> = {
  rental: "Rental Payment",
  extra_fee: "Extra Fee",
  unspecified: "Unspecified",
};

export default function PaymentManagementPage() {
  const { pathname } = useLocation();
  const isEmployee = pathname.startsWith("/employee");

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [dialogMode, setDialogMode] = useState<
    "approve" | "cancel" | "refund" | "retry" | null
  >(null);

  const [selectedFilters, setSelectedFilters] = useState<
    Partial<PaymentFilterParams>
  >({});
  const { data: branches } = useBranches();

  // Cấu hình bộ lọc động: Nhân viên chi nhánh không cần lọc theo chi nhánh nữa
  const filterConfigs = useMemo<FilterConfigItem[]>(() => {
    const baseConfigs: FilterConfigItem[] = [
      {
        key: "status",
        title: "Status",
        options: [
          { label: "Pending", value: "pending" },
          { label: "Completed", value: "completed" },
          { label: "Failed", value: "failed" },
          { label: "Processing Refund", value: "processing_refund" },
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
    ];

    if (!isEmployee) {
      baseConfigs.unshift({
        key: "branchId",
        title: "Branch",
        options: branches?.map((b) => ({ label: b.name, value: b.id })) ?? [],
      });
    }

    return baseConfigs;
  }, [branches, isEmployee]);

  const apiParams = useMemo<PaymentFilterParams>(() => {
    const trimmedSearch = search.trim();
    return {
      bookingId: trimmedSearch || undefined,
      transactionCode: trimmedSearch || undefined,
      branchId: selectedFilters.branchId, // Không cần dùng .value nữa vì state lưu trực tiếp chuỗi primitive
      status: selectedFilters.status,
      type: selectedFilters.type,
      page,
      size: 10,
    };
  }, [search, selectedFilters, page]);

  // 🌟 ĐIỀU PHỐI ĐỘNG: Gọi API tương ứng dựa trên vai trò
  const { data: adminPayments, isLoading: isAdminLoading } = usePayments(
    apiParams,
    { enabled: !isEmployee },
  );

  const { data: branchPayments, isLoading: isBranchLoading } =
    usePaymentsByBranch(page, 10, {
      enabled: isEmployee,
    });

  const isDataLoading = isEmployee ? isBranchLoading : isAdminLoading;
  const currentPaymentsResponse = isEmployee ? branchPayments : adminPayments;

  const paymentData = currentPaymentsResponse?.data || [];
  const pagination = {
    page: currentPaymentsResponse?.currentPage || 1,
    pageSize: currentPaymentsResponse?.pageSize || 10,
    totalPages: currentPaymentsResponse?.totalPages || 1,
    totalElements: currentPaymentsResponse?.totalElements || 0,
  };

  const columns = useMemo<ColumnDef<Payment>[]>(
    () => [
      {
        accessorKey: "ID",
        header: "ID",
        cell: ({ row }) => (
          <span className="font-medium">
            <IdCell id={row.original.id} prefix="#" />
          </span>
        ),
      },
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

          if (payment.status === "refunded") return null;

          if (payment.status === "processing_refund") {
            return (
              <PaymentActionDropdown
                onRefund={() => {
                  setSelectedPayment(payment);
                  setDialogMode("refund");
                }}
              />
            );
          }

          if (payment.status === "completed") return null;

          return (
            <PaymentActionDropdown
              onApproveManually={
                payment.status === "pending"
                  ? () => {
                      setSelectedPayment(payment);
                      setDialogMode("approve");
                    }
                  : undefined
              }
              onCancel={() => {
                setSelectedPayment(payment);
                setDialogMode("cancel");
              }}
              onRetry={
                payment.status === "pending" || payment.status === "failed"
                  ? () => {
                      setSelectedPayment(payment);
                      setDialogMode("retry");
                    }
                  : undefined
              }
            />
          );
        },
      },
    ],
    [],
  );

  if (isDataLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
          // Chuyển đổi State Phẳng thành dạng Object có chứa value để thích ứng với giao diện của Component Sheet
          value={Object.entries(selectedFilters).reduce(
            (acc, [key, val]) => {
              if (val) acc[key] = { value: val, label: val };
              return acc;
            },
            {} as Record<string, any>,
          )}
          onChange={(newFilters) => {
            const parsedFilters: Partial<PaymentFilterParams> = {};

            Object.entries(newFilters).forEach(([key, filterVal]) => {
              // Lấy giá trị chuỗi thực sự (từ object { value, label } hoặc string trực tiếp)
              const rawValue =
                typeof filterVal === "object" && filterVal !== null
                  ? filterVal.value
                  : filterVal;

              if (rawValue) {
                // Ép kiểu `any` khi gán động theo key để thỏa mãn TypeScript
                (parsedFilters as Record<string, any>)[key] = rawValue;
              }
            });

            setSelectedFilters(parsedFilters);
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
        mode={dialogMode ?? "approve"}
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

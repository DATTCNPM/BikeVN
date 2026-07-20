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

import { usePayments } from "@/features/payments/hooks/queries";
import { useBranches } from "@repo/hooks";
import { usePortalProfile } from "@/features/auth/hooks/usePortalProfile";

import type {
  Payment,
  PaymentStatus,
  PaymentType,
  PaymentFilterParams,
} from "@repo/schemas";

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

// Hàm hỗ trợ format ngày sang định dạng YYYY-MM-DD
const formatDateToISOString = (dateVal: any): string | undefined => {
  if (!dateVal) return undefined;
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return undefined;
  return d.toISOString().split("T")[0];
};

export default function PaymentManagementPage() {
  const { pathname } = useLocation();
  const isEmployee = pathname.startsWith("/employee");

  // Lấy thông tin user hiện tại
  const { data: user, isLoading: isProfileLoading } = usePortalProfile();
  const employeeBranchId = user?.branchId;

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

  // 1. Cấu hình bộ lọc động chuẩn hóa theo Controller BE
  const filterConfigs = useMemo<FilterConfigItem[]>(() => {
    const baseConfigs: FilterConfigItem[] = [
      {
        key: "status",
        title: "Status",
        type: "select",
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
        type: "select",
        options: [
          { label: "Rental Payment", value: "rental" },
          { label: "Extra Fee", value: "extra_fee" },
          { label: "Unspecified", value: "unspecified" },
        ],
      },
      {
        key: "fromDate",
        title: "From Date",
        type: "date",
      },
      {
        key: "toDate",
        title: "To Date",
        type: "date",
      },
      {
        key: "notes",
        title: "Notes Keyword",
        type: "text",
      },
    ];

    if (!isEmployee) {
      baseConfigs.unshift({
        key: "branchId",
        title: "Branch",
        type: "select",
        options: branches?.map((b) => ({ label: b.name, value: b.id })) ?? [],
      });
    }

    return baseConfigs;
  }, [branches, isEmployee]);

  // 2. Map các giá trị gửi lên API
  const apiParams = useMemo<PaymentFilterParams>(() => {
    const trimmedSearch = search.trim();
    return {
      bookingId: trimmedSearch || undefined,
      transactionCode: trimmedSearch || undefined,
      branchId: isEmployee ? employeeBranchId : selectedFilters.branchId,
      status: selectedFilters.status,
      type: selectedFilters.type,
      notes: selectedFilters.notes?.trim() || undefined,
      fromDate: formatDateToISOString(selectedFilters.fromDate),
      toDate: formatDateToISOString(selectedFilters.toDate),
      page,
      size: 10,
    };
  }, [search, selectedFilters, page, isEmployee, employeeBranchId]);

  // 3. Hook gọi API
  const { data: currentPaymentsResponse, isLoading: isPaymentsLoading } =
    usePayments(apiParams, {
      enabled: isEmployee ? Boolean(employeeBranchId) : true,
    });

  const isDataLoading = isPaymentsLoading || (isEmployee && isProfileLoading);

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
        accessorKey: "id",
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
          value={Object.entries(selectedFilters).reduce(
            (acc, [key, val]) => {
              if (val) {
                // Giữ lại định dạng value object phù hợp cho cả select, date và text
                acc[key] =
                  typeof val === "object" ? val : { value: val, label: val };
              }
              return acc;
            },
            {} as Record<string, any>,
          )}
          onChange={(newFilters) => {
            const parsedFilters: Partial<PaymentFilterParams> = {};

            Object.entries(newFilters).forEach(([key, filterVal]) => {
              const rawValue =
                typeof filterVal === "object" && filterVal !== null
                  ? filterVal.value
                  : filterVal;

              if (rawValue) {
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

import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import BookingActionDropdown from "@/features/bookings/components/BookingActionDropdown";
import BookingStatusDialog from "@/features/bookings/components/BookingStatusDialog";
import BookingInfoDropdown from "@/features/bookings/components/BookingInfoDropdown";
import TablePagination from "@/components/common/TablePagination";
import { Spinner } from "@repo/ui/components/ui/spinner";
import UniversalFilterSheet, {
  type FilterConfigItem,
} from "@repo/ui/components/wrapper/UniversalFilterSheet";

import ReviewCreate from "@/features/reviews/components/ReviewCreate";
import { Badge } from "@repo/ui/components/ui/badge";
import { IdCell } from "@/components/common/IdCell";
import VehicleReturnCreate from "@/features/vehicleReturns/components/VehicleReturnCreate";

import {
  useBookings,
  useBookingsByBranch, // Import hook mới dành cho Employee
  useBookingFilters,
} from "@/features/bookings/hooks/queries";
import { useBranches } from "@repo/hooks";
import type { Booking, BookingFilter } from "@repo/types";

const bookingStatusMap = {
  pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300",
  approved: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  completed:
    "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
  cancelled: "bg-zinc-200 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-300",
};

const bookingStatusLabel = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function BookingManagementPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation(); // Bắt địa chỉ URL hiện tại

  // Xác định xem người dùng hiện tại có phải là Employee không dựa vào URL Path
  const isEmployee = pathname.startsWith("/employee");

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // States quản lý Dialogs
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [dialogMode, setDialogMode] = useState<"approve" | "reject" | null>(
    null,
  );
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  // State Object quản lý bộ lọc duy nhất cho Booking
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>(
    {},
  );

  // Fetch dữ liệu nền
  const { data: branches = [], isLoading: isBranchesLoading } = useBranches();

  // 🌟 GIẢI PHÁP ĐỘNG: Chỉ gọi hook tương thích với Vai Trò để tránh dư thừa request
  const { data: adminBookings, isLoading: isAdminBookingsLoading } =
    useBookings(page, 10, { enabled: !isEmployee });

  const { data: branchBookings, isLoading: isBranchBookingsLoading } =
    useBookingsByBranch(page, 10, { enabled: isEmployee });

  // Gộp loading từ cả 2 nguồn động
  const isDataLoading = isEmployee
    ? isBranchBookingsLoading
    : isAdminBookingsLoading;

  const findNameByBranchId = (branchId: string) => {
    const branch = branches.find((b) => b.id === branchId);
    return branch ? branch.name : "Unknown Branch";
  };

  // 1. Cấu hình bộ lọc
  const filterConfigs = useMemo<FilterConfigItem[]>(() => {
    return [
      {
        key: "status",
        title: "Booking Status",
        type: "select",
        options: [
          { label: "Pending", value: "pending" },
          { label: "Approved", value: "approved" },
          { label: "Rejected", value: "rejected" },
          { label: "Completed", value: "completed" },
          { label: "Cancelled", value: "cancelled" },
        ],
      },
      {
        key: "pickupBranch",
        title: "Pickup Branch",
        type: "select",
        options: branches.map((b) => ({ label: b.name, value: b.id })),
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
        key: "userId",
        title: "Customer ID",
        type: "text",
      },
      {
        key: "vehicleId",
        title: "Vehicle ID",
        type: "text",
      },
    ];
  }, [branches]);

  // 2. Map dữ liệu bộ lọc gửi lên API
  const apiFilters = useMemo<
    BookingFilter & { page: number; size: number }
  >(() => {
    const rawFromDate = selectedFilters["fromDate"];
    const rawToDate = selectedFilters["toDate"];

    return {
      status: selectedFilters["status"]?.value,
      userId: selectedFilters["userId"]?.trim() || undefined,
      vehicleId: selectedFilters["vehicleId"]?.trim() || undefined,
      fromDate: rawFromDate ? new Date(rawFromDate).toISOString() : undefined,
      toDate: rawToDate ? new Date(rawToDate).toISOString() : undefined,
      page,
      size: 10,
    };
  }, [selectedFilters, page]);

  const hasFilter = Boolean(
    search.trim() || Object.values(selectedFilters).some(Boolean),
  );

  // Gọi API filter khi trạng thái hasFilter = true
  const { data: filteredBookings } = useBookingFilters(apiFilters, hasFilter);

  // Phân bổ dữ liệu hiển thị (Dữ liệu gốc phụ thuộc vào isEmployee)
  const defaultBookings = isEmployee ? branchBookings : adminBookings;

  const bookingData = useMemo(() => {
    return (hasFilter ? filteredBookings?.data : defaultBookings?.data) ?? [];
  }, [defaultBookings, filteredBookings, hasFilter]);

  const pagination = useMemo(() => {
    const currentSource = hasFilter ? filteredBookings : defaultBookings;
    return {
      page: currentSource?.currentPage ?? 1,
      pageSize: currentSource?.pageSize ?? 10,
      totalPages: currentSource?.totalPages ?? 1,
      totalElements: currentSource?.totalElements ?? 0,
    };
  }, [defaultBookings, filteredBookings, hasFilter]);

  const columns = useMemo<ColumnDef<Booking>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Booking ID",
        cell: ({ row }) => (
          <span className="text-sm font-medium">
            <IdCell id={row.original.id} prefix="#" />
          </span>
        ),
      },
      {
        accessorKey: "user_id",
        header: "Customer",
        cell: ({ row }) => (
          <span className="text-sm font-medium">
            <IdCell id={row.original.userId} prefix="User #" />
          </span>
        ),
      },
      {
        accessorKey: "vehicle_id",
        header: "Vehicle",
        cell: ({ row }) => (
          <span className="text-sm font-medium">
            <IdCell id={row.original.vehicleId} prefix="Vehicle #" />
          </span>
        ),
      },
      {
        accessorKey: "pickup_branch_id",
        header: "Pickup Branch",
        cell: ({ row }) => (
          <span className="text-sm">
            {findNameByBranchId(row.original.pickupBranchId)}
          </span>
        ),
      },
      {
        accessorKey: "return_branch_id",
        header: "Return Branch",
        cell: ({ row }) => (
          <span className="text-sm">
            {findNameByBranchId(row.original.returnBranchId)}
          </span>
        ),
      },
      {
        id: "info",
        header: "",
        cell: ({ row }) => <BookingInfoDropdown booking={row.original} />,
      },
      {
        accessorKey: "total_price",
        header: "Total Price",
        cell: ({ row }) => `${row.original.totalPrice?.toLocaleString()}đ`,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge className={bookingStatusMap[row.original.status]}>
            {bookingStatusLabel[row.original.status]}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const booking = row.original;
          const prefixPath = isEmployee ? "/employee" : "/admin";
          return (
            <BookingActionDropdown
              onApprove={() => {
                setSelectedBooking(booking);
                setDialogMode("approve");
              }}
              onReject={() => {
                setSelectedBooking(booking);
                setDialogMode("reject");
              }}
              onManagerVehicleReturn={
                booking.actualReturnTime
                  ? () => {
                      void navigate(
                        `${prefixPath}/bookings/${booking.id}/return`,
                      );
                    }
                  : undefined
              }
              onCreateReview={
                booking.status === "completed"
                  ? () => {
                      setSelectedBooking(booking);
                      setOpenCreateDialog(true);
                    }
                  : undefined
              }
              onCreateVehicleReturn={
                booking.actualReturnTime !== null ||
                booking.actualReturnTime !== undefined
                  ? () => {
                      setSelectedBooking(booking);
                      setOpenCreateDialog(true);
                    }
                  : undefined
              }
            />
          );
        },
      },
    ],
    [branches, navigate, isEmployee],
  );

  if (isDataLoading || isBranchesLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DataTableToolbar
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
      >
        <UniversalFilterSheet
          title="Filter Bookings"
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

      <DataTable columns={columns} data={bookingData} />

      <TablePagination
        page={pagination.page}
        pageSize={pagination.pageSize}
        totalPages={pagination.totalPages}
        totalElements={pagination.totalElements}
        onPageChange={setPage}
      />

      <BookingStatusDialog
        booking={selectedBooking}
        open={!!selectedBooking && dialogMode !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedBooking(null);
            setDialogMode(null);
          }
        }}
        mode={dialogMode ?? "approve"}
      />

      {openCreateDialog && (
        <ReviewCreate
          open={openCreateDialog}
          onOpenChange={setOpenCreateDialog}
          bookingId={selectedBooking?.id ?? ""}
        />
      )}
      {openCreateDialog && (
        <VehicleReturnCreate
          bookingId={selectedBooking?.id ?? ""}
          open={openCreateDialog}
          onOpenChange={setOpenCreateDialog}
        />
      )}
    </div>
  );
}

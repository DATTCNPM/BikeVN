import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import TablePagination from "@/components/common/TablePagination";

import { Spinner } from "@repo/ui/components/ui/spinner";
import { Badge } from "@repo/ui/components/ui/badge";
import UniversalFilterSheet, {
  type FilterConfigItem,
} from "@repo/ui/components/wrapper/UniversalFilterSheet";
import { IdCell } from "@/components/common/IdCell";

import {
  useVehicleReturnsPerBranch,
  useFilterVehicleReturns,
} from "@/features/vehicleReturns/hooks/vehicleReturnQueries";
import { usePortalProfile } from "@/features/auth/hooks/usePortalProfile";

import type { VehicleReturn, VehicleReturnFilterParams } from "@repo/schemas";

// Định nghĩa cấu trúc Object filter nhận từ UniversalFilterSheet
type SelectedFilterState = {
  [key: string]: { label: string; value: string } | undefined;
};

export default function VehicleReturnBranchPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data: profile } = usePortalProfile();
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilterState>(
    {},
  );

  // Gọi API lấy danh sách độc quyền theo chi nhánh của nhân viên hiện tại
  const { data: branchResponse, isLoading: isInitialLoading } =
    useVehicleReturnsPerBranch(page, 10);

  // Nhân viên chi nhánh chỉ được lọc theo tình trạng hao mòn xe
  const filterConfigs = useMemo<FilterConfigItem[]>(() => {
    return [
      {
        key: "conditionStatus",
        title: "Vehicle Condition",
        options: [
          { label: "Excellent", value: "excellent" },
          { label: "Good", value: "good" },
          { label: "Fair", value: "fair" },
          { label: "Damaged", value: "damaged" },
        ],
      },
    ];
  }, []);

  // Thiết lập tham số lọc (Backend tự động tiêm `returnBranchId` từ Token nên không cần truyền lên từ client)
  const apiFilters = useMemo<VehicleReturnFilterParams>(
    () => ({
      bookingId: search.trim() || undefined,
      returnBranchId: profile?.branchId || undefined, // Đảm bảo an toàn, ép chặt theo mã chi nhánh nhân viên
      conditionStatus: selectedFilters["conditionStatus"]
        ?.value as VehicleReturnFilterParams["conditionStatus"],
      page,
      size: 10,
    }),
    [search, selectedFilters, page, profile],
  );

  const hasFilter = Boolean(
    search.trim() || Object.values(selectedFilters).some(Boolean),
  );

  const { data: filteredResponse, isLoading: isFilterLoading } =
    useFilterVehicleReturns(apiFilters);

  const currentSource = hasFilter ? filteredResponse : branchResponse;

  const vehicleReturns = useMemo(() => {
    return currentSource?.data ?? [];
  }, [currentSource]);

  const pagination = useMemo(() => {
    return {
      page: currentSource?.currentPage ?? 1,
      pageSize: currentSource?.pageSize ?? 10,
      totalPages: currentSource?.totalPages ?? 1,
      totalElements: currentSource?.totalElements ?? 0,
    };
  }, [currentSource]);

  const columns = useMemo<ColumnDef<VehicleReturn>[]>(
    () => [
      {
        accessorKey: "bookingId",
        header: "Booking ID",
        cell: ({ row }) => (
          <span className="font-mono text-xs">
            <IdCell id={row.original.bookingId} prefix="#" />
          </span>
        ),
      },
      {
        accessorKey: "conditionStatus",
        header: "Condition Status",
        cell: ({ row }) => {
          const status = row.original.conditionStatus;
          return (
            <Badge
              variant={
                status === "excellent" || status === "good"
                  ? "default"
                  : "destructive"
              }
            >
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: "returnOdometerReading",
        header: "Odometer Reading",
        cell: ({ row }) =>
          `${row.original.returnOdometerReading?.toLocaleString()} km`,
      },
      {
        accessorKey: "extraFee",
        header: "Surcharge",
        cell: ({ row }) => (
          <span
            className={
              row.original.extraFee > 0
                ? "text-destructive font-semibold"
                : "text-muted-foreground"
            }
          >
            {row.original.extraFee > 0
              ? `${row.original.extraFee.toLocaleString()}đ`
              : "None"}
          </span>
        ),
      },
      {
        accessorKey: "employeeId",
        header: "Inspected By",
        cell: ({ row }) => (
          <span>
            <IdCell id={row.original.employeeId} prefix="#" />
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Date Time",
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleString("vi-VN"),
      },
    ],
    [],
  );

  if (isInitialLoading || (hasFilter && isFilterLoading)) {
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
        showCreate={false} // Khởi tạo việc trả xe nên đặt trực tiếp tại màn hình Chi tiết đơn hàng (Booking Details) sẽ tối ưu luồng dữ liệu hơn
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
      >
        <UniversalFilterSheet
          title="Filter Branch Data"
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

      <DataTable columns={columns} data={vehicleReturns} />

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

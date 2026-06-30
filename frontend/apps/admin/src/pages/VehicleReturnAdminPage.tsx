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

import { useBranches } from "@repo/hooks";
import {
  useVehicleReturnsAll,
  useFilterVehicleReturns,
} from "@/features/vehicleReturns/vehicleReturnQueries";

import type { VehicleReturn, VehicleReturnFilterParams } from "@repo/types";

// Định nghĩa cấu trúc Object filter nhận từ UniversalFilterSheet
type SelectedFilterState = {
  [key: string]: { label: string; value: string } | undefined;
};

export default function VehicleReturnAdminPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(""); // Dùng để tìm kiếm theo BookingID

  // 🟢 FIX 1: Định nghĩa lại kiểu dữ liệu cụ thể thay vì dùng unknown
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilterState>(
    {},
  );

  // Fetch danh sách chi nhánh phục vụ việc filter và danh sách mặc định của hệ thống
  const { data: branches } = useBranches();
  const { data: allResponse, isLoading: isInitialLoading } =
    useVehicleReturnsAll(page, 10);

  // Định nghĩa cấu hình hiển thị cho Filter Sheet của Admin
  const filterConfigs = useMemo<FilterConfigItem[]>(() => {
    return [
      {
        key: "returnBranchId",
        title: "Branch",
        options: branches?.map((b) => ({ label: b.name, value: b.id })) ?? [],
      },
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
  }, [branches]);

  // Ánh xạ bộ lọc từ UI thành Query Params gửi lên API Filter của backend
  const apiFilters = useMemo<VehicleReturnFilterParams>(
    () => ({
      bookingId: search.trim() || undefined,
      returnBranchId: selectedFilters["returnBranchId"]?.value,
      conditionStatus: selectedFilters["conditionStatus"]
        ?.value as VehicleReturnFilterParams["conditionStatus"],
      // Nếu UniversalFilterSheet hỗ trợ khoảng ngày, bạn truyền thêm vào đây
      fromDate: selectedFilters["fromDate"]?.value,
      toDate: selectedFilters["toDate"]?.value,
      page,
      size: 10,
    }),
    [search, selectedFilters, page],
  );

  // Kiểm tra xem Admin có đang chủ động áp dụng bộ lọc nào không
  const hasFilter = Boolean(
    search.trim() || Object.values(selectedFilters).some((f) => f && f.value),
  );

  // Thực hiện gọi API lọc nếu hasFilter = true
  const { data: filteredResponse, isLoading: isFilterLoading } =
    useFilterVehicleReturns(
      apiFilters,
      // Note: React Query sử dụng thuộc tính `enabled: hasFilter` bên trong Custom Hook
    );

  // Hợp nhất nguồn dữ liệu hiển thị
  const currentSource = hasFilter ? filteredResponse : allResponse;

  const vehicleReturns = useMemo(() => {
    return currentSource?.data ?? [];
  }, [currentSource]);

  // Tính toán thông số phân trang động
  const pagination = useMemo(() => {
    return {
      page: currentSource?.currentPage ?? 1,
      pageSize: currentSource?.pageSize ?? 10,
      totalPages: currentSource?.totalPages ?? 1,
      totalElements: currentSource?.totalElements ?? 0,
    };
  }, [currentSource]);

  // Thiết lập cột hiển thị bảng TanStack Table cho Admin
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
        accessorKey: "returnBranchId",
        header: "Return Branch",
        // 🟢 FIX 2: Ưu tiên hiển thị tên branch được populate từ backend, nếu không có mới fall back về ID
        cell: ({ row }) => (
          <span>
            <IdCell id={row.original.returnBranchId} prefix="#" />
          </span>
        ),
      },
      {
        accessorKey: "conditionStatus",
        header: "Condition",
        cell: ({ row }) => {
          const status = row.original.conditionStatus;
          return (
            <Badge
              variant={
                status === "excellent" || status === "good"
                  ? "default"
                  : "destructive"
              }
              className="capitalize"
            >
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: "returnOdometerReading",
        header: "Odometer (km)",
        cell: ({ row }) => row.original.returnOdometerReading?.toLocaleString(),
      },
      {
        accessorKey: "extraFee",
        header: "Extra Fee",
        cell: ({ row }) => (
          <span
            className={
              row.original.extraFee > 0
                ? "text-destructive font-medium"
                : "text-emerald-600"
            }
          >
            {row.original.extraFee?.toLocaleString()}đ
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created Date",
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString("vi-VN"),
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
      <div>
        <h2 className="text-xl font-bold tracking-tight">
          Global Vehicle Returns
        </h2>
        <p className="text-sm text-muted-foreground">
          Admin panel to monitor all vehicle return receipts across branches.
        </p>
      </div>

      <DataTableToolbar
        showSearch={true}
        showCreate={false}
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
      >
        <UniversalFilterSheet
          title="Filter Receipts"
          configs={filterConfigs}
          value={selectedFilters}
          onChange={(newFilters) => {
            setSelectedFilters(newFilters as SelectedFilterState);
            setPage(1);
          }}
          onReset={() => {
            setSearch("");
            setSelectedFilters({});
            setPage(1);
          }}
        />
      </DataTableToolbar>

      <DataTable columns={columns} data={vehicleReturns as any} />

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

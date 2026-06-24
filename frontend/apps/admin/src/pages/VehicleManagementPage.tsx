import { useMemo, useState } from "react";
import mockImageMotor from "@/assets/images/motorbike1.png";
import type { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import TableActionDropdown from "@/components/common/TableActionDropdown";
import TablePagination from "@/components/common/TablePagination";

import VehicleCreate from "@/features/vehicles/components/VehicleCreate";
import VehicleDelete from "@/features/vehicles/components/VehicleDelete";
import VehicleEdit from "@/features/vehicles/components/VehicleEdit";
import VehicleInfoDropdown from "@/features/vehicles/components/VehicleInfoDropdown";

import { Badge } from "@repo/ui/components/ui/badge";
import { Spinner } from "@repo/ui/components/ui/spinner";
import UniversalFilterSheet, {
  type FilterConfigItem,
} from "@repo/ui/components/wrapper/UniversalFilterSheet";

import { type Vehicle, type VehicleQueryParams } from "@repo/types";
import {
  useVehicles,
  useVehicleBrands,
  useVehicleModels,
  useBranches,
  useVehicleFilters,
} from "@repo/hooks";

const vehicleStatusMap = {
  available:
    "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
  unavailable: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  maintenance:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300",
};

const vehicleStatusLabel = {
  available: "Available",
  unavailable: "Unavailable",
  maintenance: "Under Maintenance",
};

export default function VehicleManagementPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Quản lý trạng thái Dialogs
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Gom toàn bộ mảng state filter đơn lẻ thành 1 Object duy nhất dùng chung
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>(
    {},
  );

  // Kéo dữ liệu cấu hình các bộ lọc từ API hooks
  const { data: brands } = useVehicleBrands();
  const { data: models } = useVehicleModels();
  const { data: branches } = useBranches();
  const { data: vehicles, isLoading } = useVehicles(page, 10);

  // 1. Tạo cấu hình metadata truyền vào UniversalFilterSheet
  const filterConfigs = useMemo<FilterConfigItem[]>(() => {
    return [
      {
        key: "brand",
        title: "Brand",
        options:
          brands?.data.map((b) => ({ label: b.name, value: String(b.id) })) ??
          [],
      },
      {
        key: "model",
        title: "Model",
        options:
          models?.data.map((m) => ({ label: m.name, value: String(m.id) })) ??
          [],
      },
      {
        key: "branch",
        title: "Branch",
        options: branches?.map((b) => ({ label: b.name, value: b.id })) ?? [],
      },
      {
        key: "status",
        title: "Status",
        options: [
          { label: "Available", value: "available" },
          { label: "Unavailable", value: "unavailable" },
          { label: "Under Maintenance", value: "maintenance" },
        ],
      },
      {
        key: "type",
        title: "Vehicle Type",
        options: [
          { label: "Electric Bike", value: "electric" },
          { label: "Fuel Bike", value: "fuel" },
        ],
      },
    ];
  }, [brands, models, branches]);

  // 2. Chuyển đổi Object Filter UI thành query params gửi lên Server API
  const apiFilters: VehicleQueryParams = useMemo(
    () => ({
      search: search.trim() || undefined,
      brandName: selectedFilters["brand"]?.label,
      modelName: selectedFilters["model"]?.label,
      currentBranchName: selectedFilters["branch"]?.label,
      status: selectedFilters["status"]?.value,
      vehicleType: selectedFilters["type"]?.value,
      page,
      size: 10,
    }),
    [search, selectedFilters, page],
  );

  const hasFilter = Boolean(
    search.trim() || Object.values(selectedFilters).some(Boolean),
  );

  const { data: vehicleFilters } = useVehicleFilters(apiFilters, hasFilter);

  const vehicleData = useMemo(() => {
    return (hasFilter ? vehicleFilters?.data : vehicles?.data) ?? [];
  }, [vehicles, vehicleFilters, hasFilter]);

  const pagination = useMemo(() => {
    const currentSource = hasFilter ? vehicleFilters : vehicles;
    return {
      page: currentSource?.currentPage ?? 1,
      pageSize: currentSource?.pageSize ?? 10,
      totalPages: currentSource?.totalPages ?? 1,
      totalElements: currentSource?.totalElements ?? 0,
    };
  }, [vehicles, vehicleFilters, hasFilter]);

  // Khởi tạo các Columns cho TanStack Table
  const columns = useMemo<ColumnDef<Vehicle>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Vehicle",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <img
              src={mockImageMotor}
              alt={row.original.name}
              className="h-14 w-20 rounded-md object-cover"
            />
            <div className="min-w-0">
              <p className="truncate font-medium">{row.original.name}</p>
              <p className="text-muted-foreground text-sm">
                {row.original.licensePlate}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "brand",
        header: "Brand",
        cell: ({ row }) => {
          const brand = brands?.data.find((b) => b.id === row.original.brandId);
          const model = models?.data.find((m) => m.id === row.original.modelId);
          return (
            <div>
              <p className="font-medium">{brand?.name || "N/A"}</p>
              <p className="text-muted-foreground text-sm">
                {model?.name || "N/A"}
              </p>
            </div>
          );
        },
      },
      {
        accessorKey: "price",
        header: "Rental Price",
        cell: ({ row }) => `${row.original.pricePerDay.toLocaleString()}đ`,
      },
      {
        accessorKey: "currentBranchId",
        header: "Branch",
        cell: ({ row }) => (
          <span>
            {branches?.find((b) => b.id === row.original.currentBranchId)
              ?.name || "N/A"}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge className={vehicleStatusMap[row.original.status]}>
            {vehicleStatusLabel[row.original.status]}
          </Badge>
        ),
      },
      {
        id: "info",
        header: "",
        cell: ({ row }) => <VehicleInfoDropdown vehicle={row.original} />,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <TableActionDropdown
            onManageImage={() => {
              setSelectedVehicle(row.original);
              void navigate(`/admin/vehicles/${row.original.id}/images`);
            }}
            onEdit={() => {
              setSelectedVehicle(row.original);
              setOpenEditDialog(true);
            }}
            onDelete={() => {
              setSelectedVehicle(row.original);
              setOpenDeleteDialog(true);
            }}
          />
        ),
      },
    ],
    [brands, models, navigate, branches],
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
      {/* Thanh Toolbar tích hợp Tìm kiếm & Nút mở Bộ lọc đa năng */}

      <DataTableToolbar
        showSearch={true}
        showCreate={true}
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onCreateOpen={() => setOpenCreateDialog(true)}
      >
        <UniversalFilterSheet
          title="Filter Vehicles"
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

      <DataTable columns={columns} data={vehicleData} />

      <TablePagination
        page={pagination.page}
        pageSize={pagination.pageSize}
        totalPages={pagination.totalPages}
        totalElements={pagination.totalElements}
        onPageChange={setPage}
      />

      {/* Các Dialogs giữ nguyên */}
      <VehicleCreate
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
      />
      <VehicleEdit
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        vehicle={selectedVehicle}
      />
      <VehicleDelete
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        vehicle={selectedVehicle}
      />
    </div>
  );
}

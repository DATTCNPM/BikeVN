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
import { IdCell } from "@/components/common/IdCell";

import { Badge } from "@repo/ui/components/ui/badge";
import { Spinner } from "@repo/ui/components/ui/spinner";
import UniversalFilterSheet, {
  type FilterConfigItem,
} from "@repo/ui/components/wrapper/UniversalFilterSheet";

import { type Vehicle, type VehicleQueryParams } from "@repo/types";
import { useVehicles, useVehicleFilters } from "@repo/hooks";
import { PRICE_RANGES } from "@repo/constants";

const VEHICLE_STATUS_MAP = {
  available:
    "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
  unavailable: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  maintenance:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300",
  rented: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
};

const VEHICLE_STATUS_LABEL = {
  available: "Available",
  unavailable: "Unavailable",
  maintenance: "Under Maintenance",
  rented: "Rented",
};

export default function VehicleManagementPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>(
    {},
  );

  // Fetch baseline dataset paginated records
  const { data: vehicles, isLoading: baselineLoading } = useVehicles(page, 10);

  const activePriceRange = useMemo(() => {
    return PRICE_RANGES.find(
      (p) => p.value === selectedFilters["priceRange"]?.value,
    );
  }, [selectedFilters]);

  const hasFilter = Boolean(
    search.trim() || Object.values(selectedFilters).some(Boolean),
  );

  const apiFilters: VehicleQueryParams = useMemo(
    () => ({
      search: search.trim() || undefined,
      brandName: selectedFilters["brand"]?.value,
      modelName: selectedFilters["model"]?.value,
      currentBranchName: selectedFilters["branch"]?.value,
      status: selectedFilters["status"]?.value,
      vehicleType: selectedFilters["type"]?.value,
      minPrice: activePriceRange?.min,
      maxPrice: activePriceRange?.max,
      page,
      size: 10,
    }),
    [search, selectedFilters, activePriceRange, page],
  );

  const { data: vehicleFilters, isLoading: filterLoading } = useVehicleFilters(
    apiFilters,
    hasFilter,
  );

  // Consolidate conditional backend data-stream dependencies
  const currentDataSource = hasFilter ? vehicleFilters : vehicles;
  const vehicleData = useMemo(
    () => currentDataSource?.data ?? [],
    [currentDataSource],
  );

  // Derive advanced filter items dynamically from available records
  const filterConfigs = useMemo<FilterConfigItem[]>(() => {
    const uniqueBrands = Array.from(
      new Set(vehicleData.map((v) => v.brandName).filter(Boolean)),
    );
    const uniqueModels = Array.from(
      new Set(vehicleData.map((v) => v.modelName).filter(Boolean)),
    );
    const uniqueBranches = Array.from(
      new Set(vehicleData.map((v) => v.currentBranchName).filter(Boolean)),
    );

    return [
      {
        key: "brand",
        title: "Brand / Maker",
        options: uniqueBrands.map((name) => ({ label: name, value: name })),
      },
      {
        key: "model",
        title: "Model Name",
        options: uniqueModels.map((name) => ({ label: name, value: name })),
      },
      {
        key: "branch",
        title: "Branch Location",
        options: uniqueBranches.map((name) => ({ label: name, value: name })),
      },
      {
        key: "status",
        title: "Status",
        options: [
          { label: "Available", value: "available" },
          { label: "Unavailable", value: "unavailable" },
          { label: "Under Maintenance", value: "maintenance" },
          { label: "Rented", value: "rented" },
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
      {
        key: "priceRange",
        title: "Daily Rate Range",
        options: PRICE_RANGES.map((p) => ({ label: p.label, value: p.value })),
      },
    ];
  }, [vehicleData]);

  const pagination = useMemo(
    () => ({
      page: currentDataSource?.currentPage ?? 1,
      pageSize: currentDataSource?.pageSize ?? 10,
      totalPages: currentDataSource?.totalPages ?? 1,
      totalElements: currentDataSource?.totalElements ?? 0,
    }),
    [currentDataSource],
  );

  // Define data columns layout for TanStack Table instance
  const columns = useMemo<ColumnDef<Vehicle>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Vehicle ID",
        cell: ({ row }) => <IdCell id={row.original.id} prefix="#" />,
      },
      {
        accessorKey: "name",
        header: "Vehicle Details",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <img
              src={row.original.images?.[0]?.imageUrl || mockImageMotor}
              alt={row.original.name}
              className="h-14 w-20 rounded-md object-cover"
            />
            <div className="min-w-0">
              <p className="truncate font-medium">{row.original.name}</p>
              <p className="text-muted-foreground text-sm uppercase tracking-wider">
                {row.original.licensePlate}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "brand",
        header: "Make & Model",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.brandName || "N/A"}</p>
            <p className="text-muted-foreground text-sm">
              {row.original.modelName || "N/A"}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "price",
        header: "Rental Rate",
        cell: ({ row }) =>
          `${row.original.pricePerDay.toLocaleString("en-US")} VND`,
      },
      {
        accessorKey: "currentBranchId",
        header: "Current Branch",
        cell: ({ row }) => (
          <span>{row.original.currentBranchName || "N/A"}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge className={VEHICLE_STATUS_MAP[row.original.status]}>
            {VEHICLE_STATUS_LABEL[row.original.status]}
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
    [navigate],
  );

  if (baselineLoading || (hasFilter && filterLoading)) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DataTableToolbar
        showSearch
        showCreate
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

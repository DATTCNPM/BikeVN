import { useMemo, useState } from "react";

import mockImageMotor from "@/assets/images/motorbike1.png";

import type { ColumnDef } from "@tanstack/react-table";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import TableActionDropdown from "@/components/common/TableActionDropdown";
import TablePagination from "@/components/common/TablePagination";

import VehicleCreate from "@/features/vehicles/components/VehicleCreate";
import VehicleDelete from "@/features/vehicles/components/VehicleDelete";
import VehicleEdit from "@/features/vehicles/components/VehicleEdit";

import { Badge } from "@repo/ui/components/ui/badge";
import { Spinner } from "@repo/ui/components/ui/spinner";

import { type Vehicle, type VehicleType } from "@repo/types";
import {
  useVehicles,
  useVehicleBrands,
  useVehicleModels,
  useBranches,
  useVehicleFilters,
} from "@repo/hooks";
import VehicleInfoDropdown from "@/features/vehicles/components/VehicleInfoDropdown";
import { useNavigate } from "react-router-dom";

import Filter from "@repo/ui/components/wrapper/Filter";
import type { FilterOption } from "@repo/ui/components/wrapper/Filter";
import { Button } from "@repo/ui/components/ui/button";
import type { VehicleQueryParams } from "@repo/types";

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
  const { data: brands } = useVehicleBrands();
  const { data: models } = useVehicleModels();
  const { data: branches } = useBranches();

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [selectedBrand, setSelectedBrand] = useState<FilterOption>();

  const [selectedModel, setSelectedModel] = useState<FilterOption>();

  const [selectedStatus, setSelectedStatus] = useState<FilterOption>();

  const [selectedVehicleType, setSelectedVehicleType] =
    useState<FilterOption<VehicleType>>();

  const [selectedBranch, setSelectedBranch] = useState<FilterOption>();
  const [selectedCountry, setSelectedCountry] = useState<FilterOption>();

  const [page, setPage] = useState(1);

  const brandOptions = useMemo(
    () =>
      brands?.data.map((brand) => ({
        label: brand.name,
        value: String(brand.id),
      })) ?? [],
    [brands],
  );

  const modelOptions = useMemo(
    () =>
      models?.data.map((model) => ({
        label: model.name,
        value: String(model.id),
      })) ?? [],
    [models],
  );

  const branchOptions = useMemo(
    () =>
      branches?.map((branch) => ({
        label: branch.name,
        value: branch.id,
      })) ?? [],
    [branches],
  );

  const statusOptions = [
    {
      label: "Available",
      value: "available",
    },
    {
      label: "Unavailable",
      value: "unavailable",
    },
    {
      label: "Under Maintenance",
      value: "maintenance",
    },
  ];

  const vehicleTypeOptions = [
    {
      label: "Electric Bike",
      value: "electric",
    },
    {
      label: "Fuel Bike",
      value: "fuel",
    },
  ];

  const filters: VehicleQueryParams = useMemo(
    () => ({
      search: search || undefined,
      brandName: selectedBrand ? selectedBrand.label : undefined,

      modelName: selectedModel ? selectedModel.label : undefined,

      status: selectedStatus?.value,

      vehicleType: selectedVehicleType?.value,

      currentBranchName: selectedBranch?.label,

      country: selectedCountry ? selectedCountry.label : undefined,
      maxPrice: undefined,
      minPrice: undefined,
      page: page,
      size: 10,
    }),
    [
      search,
      selectedBrand,
      selectedModel,
      selectedStatus,
      selectedVehicleType,
      selectedBranch,
      selectedCountry,
      page,
    ],
  );

  const hasFilter = Boolean(
    selectedBrand ||
    selectedModel ||
    selectedStatus ||
    selectedVehicleType ||
    selectedBranch ||
    selectedCountry ||
    search,
  );

  const { data: vehicles, isLoading } = useVehicles(page, 10);
  const { data: vehicleFilters } = useVehicleFilters(
    filters,
    Boolean(hasFilter),
  );

  const vehicleData = useMemo(() => {
    return (hasFilter ? vehicleFilters?.data : vehicles?.data) ?? [];
  }, [vehicles, vehicleFilters, hasFilter]);

  const pagination = {
    page: vehicles?.currentPage,
    pageSize: vehicles?.pageSize,
    totalPages: vehicles?.totalPages,
    totalElements: vehicles?.totalElements,
  };

  const columns = useMemo<ColumnDef<Vehicle>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Vehicle",

        cell: ({ row }) => {
          const vehicle = row.original;

          return (
            <div className="flex items-center gap-3">
              <img
                src={mockImageMotor}
                alt={vehicle.name}
                className="h-14 w-20 rounded-md object-cover"
              />

              <div className="min-w-0">
                <p className="truncate font-medium">{vehicle.name}</p>

                <p className="text-muted-foreground text-sm">
                  {vehicle.licensePlate}
                </p>
              </div>
            </div>
          );
        },
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
    <div>
      <DataTableToolbar
        search={search}
        onSearchChange={setSearch}
        onCreateOpen={() => setOpenCreateDialog(true)}
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <Filter
          title="Brand"
          options={brandOptions}
          value={selectedBrand}
          onChange={(value) => {
            setSelectedBrand(value);
            setPage(1);
          }}
        />

        <Filter
          title="Model"
          options={modelOptions}
          value={selectedModel}
          onChange={(value) => {
            setSelectedModel(value);
            setPage(1);
          }}
        />

        <Filter
          title="Branch"
          options={branchOptions}
          value={selectedBranch}
          onChange={(value) => {
            setSelectedBranch(value);
            setPage(1);
          }}
        />

        <Filter
          title="Status"
          options={statusOptions}
          value={selectedStatus}
          onChange={(value) => {
            setSelectedStatus(value);
            setPage(1);
          }}
        />

        <Filter<VehicleType>
          title="Vehicle Type"
          options={vehicleTypeOptions}
          value={selectedVehicleType}
          onChange={(value) => {
            setSelectedVehicleType(value);
            setPage(1);
          }}
        />
        <Button
          variant="outline"
          onClick={() => {
            setSelectedBrand(undefined);
            setSelectedModel(undefined);
            setSelectedStatus(undefined);
            setSelectedVehicleType(undefined);
            setSelectedBranch(undefined);
            setPage(1);
          }}
        >
          Clear Filters
        </Button>
      </div>

      <DataTable columns={columns} data={vehicleData} />

      <TablePagination
        page={pagination.page || 1}
        pageSize={pagination.pageSize || 10}
        totalPages={pagination.totalPages || 1}
        totalElements={pagination.totalElements || 0}
        onPageChange={(page) => console.log(page)}
      />
      {/* Dialogs */}
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

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

import { type Vehicle } from "@repo/types";
import { useVehicles, useVehicleBrands, useVehicleModels } from "@repo/hooks";
import VehicleInfoDropdown from "@/features/vehicles/components/VehicleInfoDropdown";
import { useNavigate } from "react-router-dom";

const vehicleStatusMap = {
  available:
    "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",

  unavailable: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",

  maintenance:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300",
};

const vehicleStatusLabel = {
  available: "Sẵn sàng",
  unavailable: "Không khả dụng",
  maintenance: "Bảo trì",
};

export default function VehicleManagementPage() {
  const { data: vehicles, isLoading } = useVehicles();
  const { data: brands = [] } = useVehicleBrands();
  const { data: models = [] } = useVehicleModels();

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const vehicleData = vehicles?.data || [];
  const pagination = {
    page: vehicles?.page,
    pageSize: vehicles?.pageSize,
    totalPages: vehicles?.totalPages,
    totalElements: vehicles?.totalElements,
  };

  const columns = useMemo<ColumnDef<Vehicle>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Xe",

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
        header: "Hãng",

        cell: ({ row }) => {
          const brand = brands.find((b) => b.id === row.original.brandId);
          const model = models.find((m) => m.id === row.original.modelId);
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
        header: "Giá thuê",

        cell: ({ row }) => `${row.original.pricePerDay.toLocaleString()}đ`,
      },

      {
        accessorKey: "currentBranchId",
        header: "Chi nhánh",

        cell: ({ row }) => (
          <span>CN #{row.original.currentBranchId || "N/A"}</span>
        ),
      },

      {
        accessorKey: "status",
        header: "Trạng thái",

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
              navigate(`/admin/vehicles/${row.original.id}/images`);
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
    [brands, models, navigate],
  );

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  console.log("Vehicle data:", vehicleData);
  console.log("Pagination info:", pagination);
  console.log("vehicle", vehicles);

  return (
    <div>
      <DataTableToolbar
        search={search}
        onSearchChange={setSearch}
        onCreateOpen={() => setOpenCreateDialog(true)}
      />

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

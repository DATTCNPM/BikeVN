import { useMemo, useState, useEffect } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import TableActionDropdown from "@/components/common/TableActionDropdown";
import TablePagination from "@/components/common/TablePagination";

import VehicleCreate from "@/components/vehicle/VehicleCreate";
import VehicleDelete from "@/components/vehicle/VehicleDelete";
import VehicleEdit from "@/components/vehicle/VehicleEdit";

import { Badge } from "@repo/ui/components/ui/badge";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { toast } from "@repo/ui/components/ui/sonner";

import { type Vehicle } from "@repo/types";
import { useVehicles } from "@repo/hooks";
import VehicleInfoDropdown from "@/components/vehicle/VehicleInfoDropdown";

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
  const { data: vehicles = [], isLoading, error } = useVehicles();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const [search, setSearch] = useState("");
  useEffect(() => {
    if (error) {
      toast.error("Không thể tải danh sách xe");
    }
  }, [error]);

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
                src={vehicle.image_url[0]}
                alt={vehicle.name}
                className="h-14 w-20 rounded-md object-cover"
              />

              <div className="min-w-0">
                <p className="truncate font-medium">{vehicle.name}</p>

                <p className="text-muted-foreground text-sm">
                  {vehicle.license_plate}
                </p>
              </div>
            </div>
          );
        },
      },

      {
        accessorKey: "brand",
        header: "Hãng",

        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.brand}</p>

            <p className="text-muted-foreground text-sm">
              {row.original.model}
            </p>
          </div>
        ),
      },

      {
        accessorKey: "price",
        header: "Giá thuê",

        cell: ({ row }) => `${row.original.price_per_day.toLocaleString()}đ`,
      },

      {
        accessorKey: "current_branch_id",
        header: "Chi nhánh",

        cell: ({ row }) => <span>CN #{row.original.current_branch_id}</span>,
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
    <div>
      <DataTableToolbar
        search={search}
        onSearchChange={setSearch}
        onCreateOpen={() => setOpenCreateDialog(true)}
      />

      <DataTable columns={columns} data={vehicles} />

      <TablePagination
        page={1}
        totalPages={10}
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

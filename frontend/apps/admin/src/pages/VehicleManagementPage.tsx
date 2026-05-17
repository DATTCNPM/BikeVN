import { useMemo, useState } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import TableActionDropdown from "@/components/common/TableActionDropdown";
import TablePagination from "@/components/common/TablePagination";

import { Badge } from "@repo/ui/components/ui/badge";

type VehicleStatus = "available" | "unavailable" | "maintenance";

type Vehicle = {
  id: number;
  name: string;
  vehicle_type: string;
  price: number;
  status: VehicleStatus;
  current_branch_id: number;
};

const vehicles: Vehicle[] = [
  {
    id: 1,
    name: "Honda Vision",
    vehicle_type: "Scooter",
    price: 150000,
    status: "available",
    current_branch_id: 1,
  },

  {
    id: 2,
    name: "Yamaha Exciter",
    vehicle_type: "Manual",
    price: 250000,
    status: "maintenance",
    current_branch_id: 2,
  },
];

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
  const [search, setSearch] = useState("");

  const columns = useMemo<ColumnDef<Vehicle>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Tên xe",
      },

      {
        accessorKey: "vehicle_type",
        header: "Loại xe",
      },

      {
        accessorKey: "price",
        header: "Giá thuê",

        cell: ({ row }) => `${row.original.price.toLocaleString()}đ`,
      },

      {
        accessorKey: "current_branch_id",
        header: "Chi nhánh",

        cell: ({ row }) => `Chi nhánh #${row.original.current_branch_id}`,
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
        id: "actions",
        header: "",

        cell: () => (
          <TableActionDropdown
            onEdit={() => console.log("edit")}
            onDelete={() => console.log("delete")}
          />
        ),
      },
    ],
    [],
  );

  return (
    <div>
      <DataTableToolbar
        search={search}
        onSearchChange={setSearch}
        onCreate={() => console.log("create")}
      />

      <DataTable columns={columns} data={vehicles} />

      <TablePagination
        page={1}
        totalPages={10}
        onPageChange={(page) => console.log(page)}
      />
    </div>
  );
}

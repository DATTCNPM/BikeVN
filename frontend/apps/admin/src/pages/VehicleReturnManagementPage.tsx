import { useMemo, useState } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import TableActionDropdown from "@/components/common/TableActionDropdown";
import TablePagination from "@/components/common/TablePagination";

import { Badge } from "@repo/ui/components/ui/badge";

type VehicleReturn = {
  id: number;
  booking_id: number;
  vehicle_id: number;
  return_branch_id: number;
  condition_status: string;
  damage_description: string | null;
  extra_fee: number;
  created_at: string;
};

const vehicleReturns: VehicleReturn[] = [
  {
    id: 1,
    booking_id: 20,
    vehicle_id: 3,
    return_branch_id: 2,
    condition_status: "Good",
    damage_description: null,
    extra_fee: 0,
    created_at: "2026-05-14 15:00",
  },
];

export default function VehicleReturnManagementPage() {
  const [search, setSearch] = useState("");

  const columns = useMemo<ColumnDef<VehicleReturn>[]>(
    () => [
      {
        accessorKey: "booking_id",
        header: "Mã đơn",
      },

      {
        accessorKey: "vehicle_id",
        header: "Mã xe",
      },

      {
        accessorKey: "return_branch_id",
        header: "Chi nhánh trả",
      },

      {
        accessorKey: "condition_status",
        header: "Tình trạng",

        cell: ({ row }) => (
          <Badge variant="secondary">{row.original.condition_status}</Badge>
        ),
      },

      {
        accessorKey: "damage_description",
        header: "Mô tả hư hỏng",

        cell: ({ row }) => row.original.damage_description || "--",
      },

      {
        accessorKey: "extra_fee",
        header: "Phí phát sinh",

        cell: ({ row }) => `${row.original.extra_fee.toLocaleString()}đ`,
      },

      {
        accessorKey: "created_at",
        header: "Ngày trả xe",
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

      <DataTable columns={columns} data={vehicleReturns} />

      <TablePagination
        page={1}
        totalPages={3}
        onPageChange={(page) => console.log(page)}
      />
    </div>
  );
}

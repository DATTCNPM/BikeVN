import { useMemo, useState } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import StatusBadge from "@/components/common/StatusBadge";
import TableActionDropdown from "@/components/common/TableActionDropdown";
import TablePagination from "@/components/common/TablePagination";

type Branch = {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  status: "active" | "inactive";
};

const branches: Branch[] = [
  {
    id: 1,
    name: "Chi nhánh Cà Mau",
    address: "123 Trần Hưng Đạo, Cà Mau",
    lat: 9.17682,
    lng: 105.15242,
    status: "active",
  },
];

export default function BranchManagementPage() {
  const [search, setSearch] = useState("");

  const columns = useMemo<ColumnDef<Branch>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Tên chi nhánh",
      },

      {
        accessorKey: "address",
        header: "Địa chỉ",
      },

      {
        accessorKey: "lat",
        header: "Latitude",
      },

      {
        accessorKey: "lng",
        header: "Longitude",
      },

      {
        accessorKey: "status",
        header: "Trạng thái",

        cell: ({ row }) => <StatusBadge status={row.original.status} />,
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

      <DataTable columns={columns} data={branches} />

      <TablePagination
        page={1}
        totalPages={5}
        onPageChange={(page) => console.log(page)}
      />
    </div>
  );
}

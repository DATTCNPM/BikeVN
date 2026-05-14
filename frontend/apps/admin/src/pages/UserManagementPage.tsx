import { useMemo, useState } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import StatusBadge from "@/components/common/StatusBadge";
import TableActionDropdown from "@/components/common/TableActionDropdown";
import TablePagination from "@/components/common/TablePagination";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  cccd_number: string;
  role: "user" | "admin";
};

const users: User[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "vana@gmail.com",
    phone: "0901234567",
    cccd_number: "079203001234",
    role: "admin",
  },
];

export default function UserManagementPage() {
  const [search, setSearch] = useState("");

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Họ tên",
      },

      {
        accessorKey: "email",
        header: "Email",
      },

      {
        accessorKey: "phone",
        header: "Số điện thoại",
      },

      {
        accessorKey: "cccd_number",
        header: "CCCD",
      },

      {
        accessorKey: "role",
        header: "Vai trò",

        cell: ({ row }) => (
          <StatusBadge
            status={row.original.role === "admin" ? "active" : "pending"}
          />
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

      <DataTable columns={columns} data={users} />

      <TablePagination
        page={1}
        totalPages={5}
        onPageChange={(page) => console.log(page)}
      />
    </div>
  );
}

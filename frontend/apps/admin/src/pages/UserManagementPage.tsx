import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import StatusBadge from "@/components/common/StatusBadge";
import TableActionDropdown from "@/components/common/TableActionDropdown";
import TablePagination from "@/components/common/TablePagination";

import { Spinner } from "@repo/ui/components/ui/spinner";

import UserCreate from "@/features/users/components/UserCreate";
import UserEdit from "@/features/users/components/UserEdit";
import UserDelete from "@/features/users/components/UserDelete";

import { useUsers } from "@/features/users/queries";

import type { User } from "@repo/types";

export default function UserManagementPage() {
  const [page, setPage] = useState(1);

  const { data: usersResponse, isLoading } = useUsers(page, 10);

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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
        accessorKey: "cccdNumber",
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
        cell: ({ row }) => (
          <TableActionDropdown
            onEdit={() => {
              setSelectedUser(row.original);
              setOpenEditDialog(true);
            }}
            onDelete={() => {
              setSelectedUser(row.original);
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

      <DataTable columns={columns} data={usersResponse?.data ?? []} />

      <TablePagination
        page={usersResponse?.currentPage ?? 1}
        totalPages={usersResponse?.totalPages ?? 1}
        totalElements={usersResponse?.totalElements ?? 0}
        pageSize={usersResponse?.pageSize ?? 10}
        onPageChange={setPage}
      />

      <UserCreate open={openCreateDialog} onOpenChange={setOpenCreateDialog} />

      <UserEdit
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        user={selectedUser}
      />

      <UserDelete
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        user={selectedUser}
      />
    </div>
  );
}

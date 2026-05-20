import { useMemo, useState, useEffect } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import StatusBadge from "@/components/common/StatusBadge";
import TableActionDropdown from "@/components/common/TableActionDropdown";
import TablePagination from "@/components/common/TablePagination";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { toast } from "@repo/ui/components/ui/sonner";

import UserCreate from "@/components/user/UserCreate";
import UserEdit from "@/components/user/UserEdit";
import UserDelete from "@/components/user/UserDelete";

import { useUsers } from "@/features/users/queries";
import type { User } from "@repo/types";

export default function UserManagementPage() {
  const { data: users = [], isLoading, error } = useUsers();
  
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (error) {
      toast.error("Không thể tải danh sách người dùng");
    }
  }, [error]);

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

      <DataTable columns={columns} data={users} />

      <TablePagination
        page={1}
        totalPages={Math.ceil(users.length / 10) || 1}
        onPageChange={(page) => console.log(page)}
      />

      {/* Dialogs */}
      <UserCreate
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
      />
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

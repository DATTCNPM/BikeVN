import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import TableActionDropdown from "@/components/common/TableActionDropdown";

import { Spinner } from "@repo/ui/components/ui/spinner";

import RoleCreate from "@/features/roles/components/RoleCreate";
import RoleDelete from "@/features/roles/components/RoleDelete";

import { useRoles } from "@/features/roles/hooks/queriesRole";

import type { RoleType } from "@repo/schemas";

export default function RoleManagementPage() {
  const { data: roles, isLoading } = useRoles();

  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const columns = useMemo<ColumnDef<RoleType>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => row.original.description || "-",
      },
      {
        accessorKey: "permissions",
        header: "Permissions",
        cell: ({ row }) => row.original.permissions.join(", ") || "-",
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <TableActionDropdown
            onDelete={() => {
              setSelectedRole(row.original);
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
        showCreate={true}
        onCreateOpen={() => setOpenCreateDialog(true)}
      />

      <DataTable columns={columns} data={roles || []} />

      <RoleCreate open={openCreateDialog} onOpenChange={setOpenCreateDialog} />

      <RoleDelete
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        role={selectedRole}
      />
    </div>
  );
}

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import TableActionDropdown from "@/components/common/TableActionDropdown";

import { Spinner } from "@repo/ui/components/ui/spinner";

import PermissionCreate from "@/features/permissions/components/PermissionCreate";
import PermissionDelete from "@/features/permissions/components/PermissionDelete";

import { usePermissions } from "@/features/permissions/hooks/queriesPermission";

import type { Permission } from "@repo/types";

export default function PermissionManagementPage() {
  const { data: permissions = [], isLoading } = usePermissions();

  const [search, setSearch] = useState("");

  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const filteredPermissions = permissions.filter((permission) =>
    permission.name.toLowerCase().includes(search.toLowerCase()),
  );

  const columns = useMemo<ColumnDef<Permission>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Permission Name",
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => row.original.description || "-",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <TableActionDropdown
            onDelete={() => {
              setSelectedPermission(row.original);
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
        search={search}
        onSearchChange={setSearch}
        onCreateOpen={() => setOpenCreateDialog(true)}
      />

      <DataTable columns={columns} data={filteredPermissions} />

      <PermissionCreate
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
      />

      <PermissionDelete
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        permission={selectedPermission}
      />
    </div>
  );
}

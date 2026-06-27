import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import TableActionDropdown from "@/components/common/TableActionDropdown";
import TablePagination from "@/components/common/TablePagination";

import { Spinner } from "@repo/ui/components/ui/spinner";

import EmployeeCreate from "@/features/employees/components/EmployeeCreate";
import EmployeeEdit from "@/features/employees/components/EmployeeEdit";
import EmployeeDelete from "@/features/employees/components/EmployeeDelete";

import { useEmployees } from "@/features/employees/queriesEmployee";
import { useBranches } from "@repo/hooks";

import type { User } from "@repo/types";

export default function UserManagementPage() {
  const [page, setPage] = useState(1);

  const { data: usersResponse, isLoading } = useEmployees(page, 10);
  const { data: branches } = useBranches();

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [search, setSearch] = useState("");

  const filterEmployee = useMemo(() => {
    return usersResponse?.data.map((employee) => {
      const branch = branches?.find((b) => b.id === employee.branchId);
      return {
        ...employee,
        branchName: branch ? branch.name : "N/A",
      };
    });
  }, [usersResponse, branches]);

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "phone",
        header: "Phone",
      },
      {
        accessorKey: "cccdNumber",
        header: "CCCD",
      },
      {
        accessorKey: "branchName",
        header: "Branch",
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

      <DataTable columns={columns} data={filterEmployee ?? []} />

      <TablePagination
        page={usersResponse?.currentPage || 1}
        totalPages={usersResponse?.totalPages || 1}
        totalElements={usersResponse?.totalElements || 0}
        pageSize={usersResponse?.pageSize || 10}
        onPageChange={setPage}
      />

      <EmployeeCreate
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
      />

      <EmployeeEdit
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        user={selectedUser}
      />

      <EmployeeDelete
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        user={selectedUser}
      />
    </div>
  );
}

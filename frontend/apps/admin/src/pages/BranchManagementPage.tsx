import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import StatusBadge from "@/components/common/StatusBadge";
import TableActionDropdown from "@/components/common/TableActionDropdown";
import TablePagination from "@/components/common/TablePagination";
import { Spinner } from "@repo/ui/components/ui/spinner";

import BranchCreate from "@/features/branches/components/BranchCreate";
import BranchEdit from "@/features/branches/components/BranchEdit";
import BranchDelete from "@/features/branches/components/BranchDelete";

import { useBranches } from "@repo/hooks";
import type { Branch } from "@repo/types";

export default function BranchManagementPage() {
  const { data: branches = [], isLoading } = useBranches();

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

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
        cell: ({ row }) => (
          <TableActionDropdown
            onEdit={() => {
              setSelectedBranch(row.original);
              setOpenEditDialog(true);
            }}
            onDelete={() => {
              setSelectedBranch(row.original);
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

      <DataTable columns={columns} data={branches} />

      <TablePagination
        page={1}
        totalPages={Math.ceil(branches.length / 10) || 1}
        onPageChange={(page) => console.log(page)}
      />

      <BranchCreate
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
      />
      <BranchEdit
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        branch={selectedBranch}
      />
      <BranchDelete
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        branch={selectedBranch}
      />
    </div>
  );
}

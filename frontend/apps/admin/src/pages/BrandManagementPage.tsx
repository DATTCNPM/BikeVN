import { useMemo, useState } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import TableActionDropdown from "@/components/common/TableActionDropdown";
import TablePagination from "@/components/common/TablePagination";

import BrandCreate from "@/features/vehicleBrand/components/BrandCreate";
import BrandEdit from "@/features/vehicleBrand/components/BrandEdit";
import BrandDelete from "@/features/vehicleBrand/components/BrandDelete";

import { Spinner } from "@repo/ui/components/ui/spinner";

import { useVehicleBrands } from "@repo/hooks";

import type { VehicleBrand } from "@repo/types";

export default function BrandManagementPage() {
  const [search, setSearch] = useState("");

  const [selectedBrand, setSelectedBrand] = useState<VehicleBrand | null>(null);

  const [openCreate, setOpenCreate] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);

  const [page, setPage] = useState(1);

  const { data: brands, isLoading } = useVehicleBrands(page, 10);

  const columns = useMemo<ColumnDef<VehicleBrand>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Brand ID",
        cell: ({ row }) => (
          <span className="text-sm font-medium">{row.original.id}</span>
        ),
      },
      {
        accessorKey: "name",
        header: "Brand Name",
      },

      {
        accessorKey: "country",
        header: "Country",
      },

      {
        accessorKey: "createdAt",
        header: "Created Date",

        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString("vi-VN"),
      },

      {
        id: "actions",
        header: "",

        cell: ({ row }) => (
          <TableActionDropdown
            onEdit={() => {
              setSelectedBrand(row.original);

              setOpenEdit(true);
            }}
            onDelete={() => {
              setSelectedBrand(row.original);

              setOpenDelete(true);
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

  console.log(brands);

  return (
    <>
      <DataTableToolbar
        search={search}
        onSearchChange={setSearch}
        onCreateOpen={() => setOpenCreate(true)}
      />

      <DataTable columns={columns} data={brands?.data || []} />

      <TablePagination
        page={brands?.currentPage || 1}
        totalPages={brands?.totalPages || 1}
        totalElements={brands?.totalElements || 0}
        pageSize={brands?.pageSize || 10}
        onPageChange={setPage}
      />

      <BrandCreate open={openCreate} onOpenChange={setOpenCreate} />

      <BrandEdit
        open={openEdit}
        onOpenChange={setOpenEdit}
        brand={selectedBrand}
      />

      <BrandDelete
        open={openDelete}
        onOpenChange={setOpenDelete}
        brand={selectedBrand}
      />
    </>
  );
}

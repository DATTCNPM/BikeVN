import { useMemo, useState } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import TableActionDropdown from "@/components/common/TableActionDropdown";
import TablePagination from "@/components/common/TablePagination";

import BrandCreate from "@/components/vehicleBrand/BrandCreate";
import BrandEdit from "@/components/vehicleBrand/BrandEdit";
import BrandDelete from "@/components/vehicleBrand/BrandDelete";

import { Spinner } from "@repo/ui/components/ui/spinner";

import { useVehicleBrands } from "@repo/hooks";

import type { VehicleBrand } from "@repo/types";

export default function BrandManagementPage() {
  const { data: brands = [], isLoading } = useVehicleBrands();

  const [search, setSearch] = useState("");

  const [selectedBrand, setSelectedBrand] = useState<VehicleBrand | null>(null);

  const [openCreate, setOpenCreate] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);

  const columns = useMemo<ColumnDef<VehicleBrand>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Hãng xe",
      },

      {
        accessorKey: "country",
        header: "Quốc gia",
      },

      {
        accessorKey: "createdAt",
        header: "Ngày tạo",

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

      <DataTable columns={columns} data={brands} />

      <TablePagination page={1} totalPages={1} onPageChange={() => {}} />

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

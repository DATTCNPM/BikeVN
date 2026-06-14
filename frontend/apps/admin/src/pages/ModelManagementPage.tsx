import { useMemo, useState } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import TableActionDropdown from "@/components/common/TableActionDropdown";
import TablePagination from "@/components/common/TablePagination";

import ModelCreate from "@/features/vehicleModel/components/ModelCreate";
import ModelEdit from "@/features/vehicleModel/components/ModelEdit";
import ModelDelete from "@/features/vehicleModel/components/ModelDelete";

import { Spinner } from "@repo/ui/components/ui/spinner";

import { useVehicleBrands, useVehicleModels } from "@repo/hooks";

import type { VehicleBrand, VehicleModel } from "@repo/types";

export default function ModelManagementPage() {
  const { data: models, isLoading } = useVehicleModels();

  const { data: brands, isLoading: isBrandsLoading } = useVehicleBrands();

  const [search, setSearch] = useState("");

  const [selectedModel, setSelectedModel] = useState<VehicleModel | null>(null);

  const [openCreate, setOpenCreate] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);

  const [page, setPage] = useState(1);

  const columns = useMemo<ColumnDef<VehicleModel>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Model",
      },

      {
        id: "brand",

        header: "Hãng xe",

        cell: ({ row }) => {
          const brand = brands?.data.find(
            (item: VehicleBrand) => item.id === row.original.brandId,
          );

          return brand?.name ?? "N/A";
        },
      },

      {
        accessorKey: "engineCapacity",

        header: "Dung tích",

        cell: ({ row }) => `${row.original.engineCapacity}cc`,
      },

      {
        id: "yearRange",

        header: "Đời xe",

        cell: ({ row }) =>
          `${row.original.yearFrom ?? "-"} - ${
            row.original.yearTo ?? "Hiện tại"
          }`,
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
              setSelectedModel(row.original);

              setOpenEdit(true);
            }}
            onDelete={() => {
              setSelectedModel(row.original);

              setOpenDelete(true);
            }}
          />
        ),
      },
    ],
    [brands],
  );

  if (isLoading || isBrandsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <DataTableToolbar
        search={search}
        onSearchChange={setSearch}
        onCreateOpen={() => setOpenCreate(true)}
      />

      <DataTable columns={columns} data={models?.data || []} />

      <TablePagination
        page={models?.currentPage || 1}
        totalPages={models?.totalPages || 1}
        totalElements={models?.totalElements || 0}
        pageSize={models?.pageSize || 10}
        onPageChange={setPage}
      />

      <ModelCreate open={openCreate} onOpenChange={setOpenCreate} />

      <ModelEdit
        open={openEdit}
        onOpenChange={setOpenEdit}
        model={selectedModel}
      />

      <ModelDelete
        open={openDelete}
        onOpenChange={setOpenDelete}
        model={selectedModel}
      />
    </>
  );
}

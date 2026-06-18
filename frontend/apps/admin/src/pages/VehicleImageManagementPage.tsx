import { useMemo, useState } from "react";

import { useParams } from "react-router-dom";

import type { ColumnDef } from "@tanstack/react-table";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import TableActionDropdown from "@/components/common/TableActionDropdown";
// import TablePagination from "@/components/common/TablePagination";

import VehicleImageCreate from "@/features/vehicleImages/components/ImageCreate";
import VehicleImageEdit from "@/features/vehicleImages/components/ImageEdit";
import VehicleImageDelete from "@/features/vehicleImages/components/ImageDelete";

import { Badge } from "@repo/ui/components/ui/badge";
import { Spinner } from "@repo/ui/components/ui/spinner";

import { useVehicleImages } from "@repo/hooks";

import type { VehicleImage } from "@repo/types";

export default function VehicleImageManagementPage() {
  const { vehicleId = "" } = useParams();

  const { data: images = [], isLoading } = useVehicleImages(vehicleId);

  const [search, setSearch] = useState("");

  const [selectedImage, setSelectedImage] = useState<VehicleImage | null>(null);

  const [openCreate, setOpenCreate] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);

  const columns = useMemo<ColumnDef<VehicleImage>[]>(
    () => [
      {
        accessorKey: "imageUrl",

        header: "Image",

        cell: ({ row }) => (
          <img
            src={`http://localhost:8080${row.original.imageUrl}`}
            alt={row.original.altText ?? ""}
            className="h-20 w-32 rounded-lg border object-cover"
          />
        ),
      },

      {
        accessorKey: "altText",

        header: "Description",

        cell: ({ row }) => row.original.altText || "-",
      },

      {
        accessorKey: "displayOrder",

        header: "Order",
      },

      {
        accessorKey: "isPrimary",

        header: "Type",

        cell: ({ row }) =>
          row.original.isPrimary ? (
            <Badge>Primary Image</Badge>
          ) : (
            <Badge variant="secondary">Secondary Image</Badge>
          ),
      },

      {
        accessorKey: "createdAt",

        header: "Creation Date",

        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString("vi-VN"),
      },

      {
        id: "actions",

        header: "",

        cell: ({ row }) => (
          <TableActionDropdown
            onEdit={() => {
              setSelectedImage(row.original);

              setOpenEdit(true);
            }}
            onDelete={() => {
              setSelectedImage(row.original);

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

  console.log("Vehicle images:", images);

  return (
    <>
      <DataTableToolbar
        search={search}
        onSearchChange={setSearch}
        onCreateOpen={() => setOpenCreate(true)}
      />

      <DataTable columns={columns} data={images} />

      {/* <TablePagination page={1} totalPages={1} onPageChange={() => {}} /> */}

      <VehicleImageCreate
        open={openCreate}
        onOpenChange={setOpenCreate}
        vehicleId={vehicleId}
      />

      <VehicleImageEdit
        open={openEdit}
        onOpenChange={setOpenEdit}
        vehicleId={vehicleId}
        image={selectedImage}
      />

      <VehicleImageDelete
        open={openDelete}
        onOpenChange={setOpenDelete}
        vehicleId={vehicleId}
        image={selectedImage}
      />
    </>
  );
}

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
import UniversalFilterSheet, {
  type FilterConfigItem,
} from "@repo/ui/components/wrapper/UniversalFilterSheet";

import { useVehicleBrands, useVehicleBrandFilters } from "@repo/hooks";
import type { VehicleBrand, VehicleBrandQueryParams } from "@repo/types";

export default function BrandManagementPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [selectedBrand, setSelectedBrand] = useState<VehicleBrand | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // 1. Quản lý trạng thái bộ lọc trên UI
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>(
    {},
  );

  // 2. Fetch dữ liệu mặc định (Phân trang cơ bản)
  const { data: brandsResponse, isLoading: isInitialLoading } =
    useVehicleBrands(page, 10);

  // 3. Định nghĩa cấu hình hiển thị cho Filter Sheet quốc gia
  const filterConfigs = useMemo<FilterConfigItem[]>(() => {
    return [
      {
        key: "country",
        title: "Country / Origin",
        options: [
          { label: "Japan (Nhật Bản)", value: "Japan" },
          { label: "Italy (Ý)", value: "Italy" },
          { label: "Taiwan (Đài Loan)", value: "Taiwan" },
          { label: "Vietnam (Việt Nam)", value: "Vietnam" },
          { label: "Germany (Đức)", value: "Germany" },
        ],
      },
    ];
  }, []);

  // 4. Ánh xạ từ UI sang Query Params gửi lên Server
  const apiFilters = useMemo<VehicleBrandQueryParams>(
    () => ({
      name: search.trim() || undefined,
      country: selectedFilters["country"]?.value || undefined,
      page,
      size: 10,
    }),
    [search, selectedFilters, page],
  );

  // 5. Kiểm tra trạng thái kích hoạt bộ lọc của User
  const hasFilter = Boolean(
    search.trim() || Object.values(selectedFilters).some(Boolean),
  );

  // 6. Kích hoạt gọi API Filter nếu điều kiện hasFilter = true
  const { data: filteredResponse, isLoading: isFilterLoading } =
    useVehicleBrandFilters(apiFilters, hasFilter);

  // 7. Chọn nguồn dữ liệu hiển thị tương thích
  const currentSource = hasFilter ? filteredResponse : brandsResponse;

  // 8. Đồng bộ phân trang động
  const pagination = useMemo(() => {
    return {
      page: currentSource?.currentPage ?? 1,
      pageSize: currentSource?.pageSize ?? 10,
      totalPages: currentSource?.totalPages ?? 1,
      totalElements: currentSource?.totalElements ?? 0,
    };
  }, [currentSource]);

  const columns = useMemo<ColumnDef<VehicleBrand>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Brand ID",
        cell: ({ row }) => (
          <span className="text-sm font-medium">#{row.original.id}</span>
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

  if (isInitialLoading || (hasFilter && isFilterLoading)) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DataTableToolbar
        showSearch={true}
        showCreate={true}
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1); // Quay về trang 1 khi gõ tìm kiếm
        }}
        onCreateOpen={() => setOpenCreate(true)}
      >
        <UniversalFilterSheet
          title="Filter Brands"
          configs={filterConfigs}
          value={selectedFilters}
          onChange={(newFilters) => {
            setSelectedFilters(newFilters);
            setPage(1); // Quay về trang 1 khi đổi bộ lọc
          }}
          onReset={() => {
            setSearch("");
            setSelectedFilters({});
            setPage(1);
          }}
        />
      </DataTableToolbar>

      <DataTable columns={columns} data={currentSource?.data || []} />

      <TablePagination
        page={pagination.page}
        pageSize={pagination.pageSize}
        totalPages={pagination.totalPages}
        totalElements={pagination.totalElements}
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
    </div>
  );
}

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
import UniversalFilterSheet, {
  type FilterConfigItem,
} from "@repo/ui/components/wrapper/UniversalFilterSheet";

import {
  useVehicleBrands,
  useVehicleModels,
  useVehicleModelFilters,
} from "@repo/hooks";
import type {
  VehicleBrand,
  VehicleModel,
  VehicleModelQueryParams,
} from "@repo/types";

export default function ModelManagementPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [selectedModel, setSelectedModel] = useState<VehicleModel | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // 1. Quản lý trạng thái bộ lọc trên UI
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>(
    {},
  );

  // 2. Fetch dữ liệu mặc định (Phân trang cơ bản)
  const { data: brands, isLoading: isBrandsLoading } = useVehicleBrands(1, 100); // Lấy danh sách nhiều để map vào filter
  const { data: modelsResponse, isLoading: isInitialLoading } =
    useVehicleModels(page, 10);

  // 3. Định nghĩa cấu hình hiển thị cho Filter Sheet (Nạp Brand động từ API về)
  const filterConfigs = useMemo<FilterConfigItem[]>(() => {
    const brandOptions =
      brands?.data?.map((b: VehicleBrand) => ({
        label: b.name,
        value: String(b.id),
      })) || [];

    return [
      {
        key: "brandId",
        title: "Vehicle Brand",
        options: brandOptions,
      },
      {
        key: "engineCapacityRange",
        title: "Engine Capacity",
        options: [
          { label: "Dưới 150cc", value: "0-149" },
          { label: "Từ 150cc - 250cc", value: "150-250" },
          { label: "Trên 250cc (Phân khối lớn)", value: "251-2000" },
        ],
      },
      {
        key: "productionYear",
        title: "Production Year",
        options: Array.from({ length: 10 }, (_, i) => {
          const year = new Date().getFullYear() - i;
          return { label: String(year), value: String(year) };
        }),
      },
    ];
  }, [brands]);

  // 4. Ánh xạ dữ liệu từ UI thành Query Params chuẩn Backend yêu cầu
  const apiFilters = useMemo<VehicleModelQueryParams>(() => {
    const capacityRange = selectedFilters["engineCapacityRange"]?.value;
    let minCapacity: number | undefined = undefined;
    let maxCapacity: number | undefined = undefined;

    if (capacityRange) {
      const [min, max] = capacityRange.split("-").map(Number);
      minCapacity = min;
      maxCapacity = max;
    }

    return {
      name: search.trim() || undefined,
      brandId: selectedFilters["brandId"]
        ? Number(selectedFilters["brandId"].value)
        : undefined,
      minEngineCapacity: minCapacity,
      maxEngineCapacity: maxCapacity,
      productionYear: selectedFilters["productionYear"]
        ? Number(selectedFilters["productionYear"].value)
        : undefined,
      page,
      size: 10,
    };
  }, [search, selectedFilters, page]);

  // 5. Xác định xem người dùng có đang kích hoạt bộ lọc không
  const hasFilter = Boolean(
    search.trim() || Object.values(selectedFilters).some(Boolean),
  );

  // 6. Fetch dữ liệu thông qua API Filter nếu có bộ lọc kích hoạt
  const { data: filteredResponse, isLoading: isFilterLoading } =
    useVehicleModelFilters(apiFilters, hasFilter);

  // 7. Hợp nhất nguồn dữ liệu hiển thị phụ thuộc vào trạng thái lọc
  const currentSource = hasFilter ? filteredResponse : modelsResponse;

  // 8. Tính toán thông số phân trang động dựa trên nguồn dữ liệu hiện hành
  const pagination = useMemo(() => {
    return {
      page: currentSource?.currentPage ?? 1,
      pageSize: currentSource?.pageSize ?? 10,
      totalPages: currentSource?.totalPages ?? 1,
      totalElements: currentSource?.totalElements ?? 0,
    };
  }, [currentSource]);

  // 9. Cấu hình bảng hiển thị dữ liệu
  const columns = useMemo<ColumnDef<VehicleModel>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Model ID",
        cell: ({ row }) => (
          <span className="text-sm font-medium">#{row.original.id}</span>
        ),
      },
      {
        accessorKey: "name",
        header: "Model",
      },
      {
        id: "brand",
        header: "Brand",
        cell: ({ row }) => {
          const brand = brands?.data?.find(
            (item: VehicleBrand) => item.id === row.original.brandId,
          );
          return brand?.name ?? "N/A";
        },
      },
      {
        accessorKey: "engineCapacity",
        header: "Engine Capacity",
        cell: ({ row }) => `${row.original.engineCapacity}cc`,
      },
      {
        id: "yearRange",
        header: "Year Range",
        cell: ({ row }) =>
          `${row.original.yearFrom ?? "-"} - ${row.original.yearTo ?? "Current"}`,
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
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

  if (isInitialLoading || isBrandsLoading || (hasFilter && isFilterLoading)) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="text-slate-500 animate-pulse">
          <Spinner />
        </span>
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
          setPage(1); // Reset trang về 1 khi gõ tìm kiếm
        }}
        onCreateOpen={() => setOpenCreate(true)}
      >
        <UniversalFilterSheet
          title="Filter Models"
          configs={filterConfigs}
          value={selectedFilters}
          onChange={(newFilters) => {
            setSelectedFilters(newFilters);
            setPage(1); // Reset trang về 1 khi áp dụng bộ lọc mới
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
    </div>
  );
}

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import TableActionDropdown from "@/components/common/TableActionDropdown";
import TablePagination from "@/components/common/TablePagination";

import { Spinner } from "@repo/ui/components/ui/spinner";
import UniversalFilterSheet, {
  type FilterConfigItem,
} from "@repo/ui/components/wrapper/UniversalFilterSheet";
import { IdCell } from "@/components/common/IdCell";

import EmployeeCreate from "@/features/employees/components/EmployeeCreate";
import EmployeeEdit from "@/features/employees/components/EmployeeEdit";
import EmployeeDelete from "@/features/employees/components/EmployeeDelete";

// Hãy đảm bảo bạn đã export useEmployeeFilters từ file queries này tương tự như bên User
import {
  useEmployees,
  useEmployeeFilters,
} from "@/features/employees/hooks/queriesEmployee";
import { useBranches } from "@repo/hooks";

import type { User } from "@repo/types";

export default function EmployeeManagementPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // 1. Quản lý trạng thái bộ lọc trên UI cho Nhân viên
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>(
    {},
  );

  // 2. Fetch dữ liệu nền: Danh sách chi nhánh & danh sách employees mặc định
  const { data: branches, isLoading: isBranchesLoading } = useBranches();
  const { data: usersResponse, isLoading: isInitialLoading } = useEmployees(
    page,
    10,
  );

  // 3. Định nghĩa cấu hình hiển thị cho Filter Sheet (Nhân viên chỉ cần lọc theo Chi nhánh và Trạng thái)
  const filterConfigs = useMemo<FilterConfigItem[]>(() => {
    return [
      {
        key: "branchId",
        title: "Branch",
        options: branches?.map((b) => ({ label: b.name, value: b.id })) ?? [],
      },
      {
        key: "isActive",
        title: "Status",
        options: [
          { label: "Active", value: "true" },
          { label: "Inactive", value: "false" },
        ],
      },
    ];
  }, [branches]);

  // 4. Ánh xạ bộ lọc từ UI thành Query Params gửi lên API Employee
  const apiFilters = useMemo(() => {
    return {
      keyword: search.trim() || undefined,
      branchId: selectedFilters["branchId"]?.value,
      isActive: selectedFilters["isActive"]
        ? selectedFilters["isActive"].value === "true"
        : undefined,
      page,
      size: 10,
    };
  }, [search, selectedFilters, page]);

  // 5. Xác định xem người dùng có đang áp dụng bất kỳ bộ lọc nào không
  const hasFilter = Boolean(
    search.trim() || Object.values(selectedFilters).some(Boolean),
  );

  // 6. Gọi API filter nhân viên nếu điều kiện hasFilter = true
  const { data: filteredResponse, isLoading: isFilterLoading } =
    useEmployeeFilters(apiFilters, hasFilter);

  // 7. Chọn nguồn dữ liệu hiện tại dựa trên việc có đang filter hay không
  const currentSource = hasFilter ? filteredResponse : usersResponse;

  // 8. Hợp nhất dữ liệu và map thêm thuộc tính `branchName` để hiển thị trên bảng công bằng
  const processedEmployees = useMemo(() => {
    const rawData = currentSource?.data ?? [];
    return rawData.map((employee) => {
      const branch = branches?.find((b) => b.id === employee.branchId);
      return {
        ...employee,
        branchName: branch ? branch.name : "N/A",
      };
    });
  }, [currentSource, branches]);

  // 9. Tính toán thông số phân trang động
  const pagination = useMemo(() => {
    return {
      page: currentSource?.currentPage ?? 1,
      pageSize: currentSource?.pageSize ?? 10,
      totalPages: currentSource?.totalPages ?? 1,
      totalElements: currentSource?.totalElements ?? 0,
    };
  }, [currentSource]);

  // 10. Cấu hình các cột hiển thị trong TanStack Table
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Employee ID",
        cell: ({ row }) => <IdCell id={row.original.id} prefix="#" />,
      },
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

  // Hiển thị màn hình chờ khi có bất kỳ nguồn dữ liệu chính nào đang load
  if (isInitialLoading || isBranchesLoading || (hasFilter && isFilterLoading)) {
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
          setPage(1); // Trở về trang đầu khi gõ tìm kiếm
        }}
        onCreateOpen={() => setOpenCreateDialog(true)}
      >
        <UniversalFilterSheet
          title="Filter Employees"
          configs={filterConfigs}
          value={selectedFilters}
          onChange={(newFilters) => {
            setSelectedFilters(newFilters);
            setPage(1); // Trở về trang đầu khi thay đổi bộ lọc
          }}
          onReset={() => {
            setSearch("");
            setSelectedFilters({});
            setPage(1);
          }}
        />
      </DataTableToolbar>

      <DataTable columns={columns} data={processedEmployees} />

      <TablePagination
        page={pagination.page}
        pageSize={pagination.pageSize}
        totalPages={pagination.totalPages}
        totalElements={pagination.totalElements}
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

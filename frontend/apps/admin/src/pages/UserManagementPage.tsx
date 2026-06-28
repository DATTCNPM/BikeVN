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

import UserCreate from "@/features/users/components/UserCreate";
import UserEdit from "@/features/users/components/UserEdit";
import UserDelete from "@/features/users/components/UserDelete";

import { useUsers } from "@/features/users/queries";
import { useBranches } from "@repo/hooks";
import { useUserFilters } from "@/features/users/queries";

import type { User, UserQueryParams } from "@repo/types";

export default function UserManagementPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // 1. Quản lý trạng thái bộ lọc trên UI
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>(
    {},
  );

  // 2. Fetch data từ API danh sách chi nhánh & danh sách users mặc định
  const { data: branches } = useBranches();
  const { data: usersResponse, isLoading: isInitialLoading } = useUsers(
    page,
    10,
  );

  // 3. Định nghĩa cấu hình hiển thị cho Filter Sheet
  const filterConfigs = useMemo<FilterConfigItem[]>(() => {
    return [
      {
        key: "branchId",
        title: "Branch",
        options: branches?.map((b) => ({ label: b.name, value: b.id })) ?? [],
      },
      {
        key: "roleName",
        title: "Role",
        options: [
          { label: "Admin", value: "admin" },
          { label: "Employee", value: "employee" },
          { label: "Customer", value: "customer" },
        ],
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

  // 4. Ánh xạ bộ lọc từ UI thành Query Params gửi lên API
  const apiFilters = useMemo<UserQueryParams>(
    () => ({
      keyword: search.trim() || undefined,
      branchId: selectedFilters["branchId"]?.value,
      roleName: selectedFilters["roleName"]?.value,
      isActive: selectedFilters["isActive"]
        ? selectedFilters["isActive"].value === "true"
        : undefined,
      page,
      size: 10,
    }),
    [search, selectedFilters, page],
  );

  // 5. Xác định xem người dùng có đang áp dụng bất kỳ bộ lọc nào không
  const hasFilter = Boolean(
    search.trim() || Object.values(selectedFilters).some(Boolean),
  );

  // 6. Fetch dữ liệu lọc nếu điều kiện hasFilter = true
  const { data: filteredResponse, isLoading: isFilterLoading } = useUserFilters(
    apiFilters,
    hasFilter,
  );

  // 7. Hợp nhất nguồn dữ liệu và loại bỏ tài khoản Admin hệ thống
  const currentSource = hasFilter ? filteredResponse : usersResponse;

  const filteredUsers = useMemo(() => {
    return (
      currentSource?.data.filter((user) => user.email !== "admin@gmail.com") ??
      []
    );
  }, [currentSource]);

  // 8. Tính toán thông số phân trang động
  const pagination = useMemo(() => {
    return {
      page: currentSource?.currentPage ?? 1,
      pageSize: currentSource?.pageSize ?? 10,
      totalPages: currentSource?.totalPages ?? 1,
      totalElements: currentSource?.totalElements ?? 0,
    };
  }, [currentSource]);

  // 9. Cấu hình các cột hiển thị trong TanStack Table
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

  // Hiển thị loading spinner khi dữ liệu ban đầu hoặc kết quả lọc đang tải
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
          setPage(1);
        }}
        onCreateOpen={() => setOpenCreateDialog(true)}
      >
        <UniversalFilterSheet
          title="Filter Users"
          configs={filterConfigs}
          value={selectedFilters}
          onChange={(newFilters) => {
            setSelectedFilters(newFilters);
            setPage(1);
          }}
          onReset={() => {
            setSearch("");
            setSelectedFilters({});
            setPage(1);
          }}
        />
      </DataTableToolbar>

      <DataTable columns={columns} data={filteredUsers} />

      <TablePagination
        page={pagination.page}
        pageSize={pagination.pageSize}
        totalPages={pagination.totalPages}
        totalElements={pagination.totalElements}
        onPageChange={setPage}
      />

      <UserCreate open={openCreateDialog} onOpenChange={setOpenCreateDialog} />

      <UserEdit
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        user={selectedUser}
      />

      <UserDelete
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        user={selectedUser}
      />
    </div>
  );
}

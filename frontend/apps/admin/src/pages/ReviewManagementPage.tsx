import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MessageSquare, Star } from "lucide-react";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import TableActionDropdown from "@/components/common/TableActionDropdown";
import TablePagination from "@/components/common/TablePagination";

import { Spinner } from "@repo/ui/components/ui/spinner";
import { Badge } from "@repo/ui/components/ui/badge";
import UniversalFilterSheet, {
  type FilterConfigItem,
} from "@repo/ui/components/wrapper/UniversalFilterSheet";

import ReviewDelete from "@/features/reviews/components/ReviewDelete";
import { useAdminReviews } from "@/features/reviews/queries/useAdminReviews";

import type { Review, ReviewQueryParams } from "@repo/types";

export default function ReviewManagementPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Lưu ý: Controller không có param 'keyword' chung mà có cụ thể từng ID.
  // Biến search này có thể dùng để lọc nhanh bookingId hoặc bạn có thể tắt đi.
  const [search, setSearch] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  // 1. Quản lý trạng thái bộ lọc trên UI
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>(
    {},
  );

  // 2. Định nghĩa cấu hình hiển thị cho Filter Sheet (Rating)
  const filterConfigs = useMemo<FilterConfigItem[]>(() => {
    return [
      {
        key: "rating",
        title: "Rating",
        options: [
          { label: "5 Stars", value: "5" },
          { label: "4 Stars", value: "4" },
          { label: "3 Stars", value: "3" },
          { label: "2 Stars", value: "2" },
          { label: "1 Star", value: "1" },
        ],
      },
    ];
  }, []);

  // 3. Ánh xạ bộ lọc từ UI & Ô tìm kiếm thành Query Params gửi lên API
  const apiFilters = useMemo<ReviewQueryParams>(
    () => ({
      // Nếu nhập text ở ô search, coi như đang tìm chính xác theo bookingId
      bookingId: search.trim() || selectedFilters["bookingId"] || undefined,
      vehicleId: selectedFilters["vehicleId"] || undefined,
      userId: selectedFilters["userId"] || undefined,
      rating: selectedFilters["rating"]
        ? Number(selectedFilters["rating"].value)
        : undefined,
      page,
      size: pageSize,
    }),
    [search, selectedFilters, page, pageSize],
  );

  // 4. Fetch dữ liệu thông qua Custom Hook đã cập nhật
  const { data, isLoading } = useAdminReviews(apiFilters);

  const reviews = data?.data ?? [];

  // 5. Cấu hình TanStack Table Columns
  const columns = useMemo<ColumnDef<Review>[]>(
    () => [
      {
        accessorKey: "bookingId",
        header: "Booking ID",
        cell: ({ row }) => (
          <span className="text-sm font-medium">
            #{row.original.bookingId.slice(0, 6)}
          </span>
        ),
      },
      {
        accessorKey: "userId",
        header: "User ID",
        cell: ({ row }) => (
          <span className="text-sm">
            User #{row.original.userId.slice(0, 6)}
          </span>
        ),
      },
      {
        accessorKey: "vehicleId",
        header: "Vehicle ID",
        cell: ({ row }) => (
          <span className="text-sm font-medium">
            Xe #{row.original.vehicleId.slice(0, 6)}
          </span>
        ),
      },
      {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            {Array.from({
              length: row.original.rating,
            }).map((_, index) => (
              <Star
                key={index}
                className="size-4 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
        ),
      },
      {
        accessorKey: "comment",
        header: "Comment",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <MessageSquare className="size-4 text-muted-foreground" />
            <span className="max-w-[300px] truncate">
              {row.original.comment || "--"}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleString("vi-VN"),
      },
      {
        id: "status",
        header: "Status",
        cell: () => (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300">
            Visible
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <TableActionDropdown
            onDelete={() => {
              setSelectedReview(row.original);
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
    <div className="space-y-4">
      <DataTableToolbar
        showSearch={true}
        showCreate={false}
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1); // Reset trang về 1 khi tìm kiếm
        }}
      >
        <UniversalFilterSheet
          title="Filter Reviews"
          configs={filterConfigs}
          value={selectedFilters}
          onChange={(newFilters) => {
            setSelectedFilters(newFilters);
            setPage(1); // Reset trang về 1 khi áp bộ lọc mới
          }}
          onReset={() => {
            setSearch("");
            setSelectedFilters({});
            setPage(1);
          }}
        />
      </DataTableToolbar>

      <DataTable columns={columns} data={reviews} />

      <TablePagination
        page={data?.currentPage || 1}
        pageSize={data?.pageSize || 10}
        totalElements={data?.totalElements || 0}
        totalPages={data?.totalPages || 1}
        onPageChange={setPage}
      />

      <ReviewDelete
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        review={selectedReview}
      />
    </div>
  );
}

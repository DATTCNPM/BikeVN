import { useMemo, useState, useEffect } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { MessageSquare, Star } from "lucide-react";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import TableActionDropdown from "@/components/common/TableActionDropdown";
import TablePagination from "@/components/common/TablePagination";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { toast } from "@repo/ui/components/ui/sonner";

import { Badge } from "@repo/ui/components/ui/badge";

import ReviewEdit from "@/components/review/ReviewEdit";
import ReviewDelete from "@/components/review/ReviewDelete";

import { useAllReviews } from "@repo/hooks";
import type { Review } from "@repo/types";

export default function ReviewManagementPage() {
  const { data: reviews = [], isLoading, error } = useAllReviews();

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (error) {
      toast.error("Không thể tải danh sách đánh giá");
    }
  }, [error]);

  const columns = useMemo<ColumnDef<Review>[]>(
    () => [
      {
        accessorKey: "booking_id",
        header: "Mã đơn",
        cell: ({ row }) => <span className="text-sm font-medium">#{row.original.booking_id.substring(0, 6)}</span>,
      },
      {
        accessorKey: "user_id",
        header: "Mã người dùng",
        cell: ({ row }) => <span className="text-sm">User #{row.original.user_id.substring(0, 6)}</span>,
      },
      {
        accessorKey: "vehicle_id",
        header: "Mã xe",
        cell: ({ row }) => <span className="text-sm font-medium">Xe #{row.original.vehicle_id.substring(0, 6)}</span>,
      },
      {
        accessorKey: "rating",
        header: "Đánh giá",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            {Array.from({ length: row.original.rating }).map((_, index) => (
              <Star key={index} className="size-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        ),
      },
      {
        accessorKey: "comment",
        header: "Bình luận",
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
        accessorKey: "created_at",
        header: "Ngày đánh giá",
        cell: ({ row }) => new Date(row.original.created_at).toLocaleString("vi-VN"),
      },
      {
        id: "status",
        header: "Trạng thái",
        cell: () => (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300">
            Hiển thị
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <TableActionDropdown
            onEdit={() => {
              setSelectedReview(row.original);
              setOpenEditDialog(true);
            }}
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
    <div>
      <DataTableToolbar
        search={search}
        onSearchChange={setSearch}
      />

      <DataTable columns={columns} data={reviews} />

      <TablePagination
        page={1}
        totalPages={Math.ceil(reviews.length / 10) || 1}
        onPageChange={(page) => console.log(page)}
      />

      <ReviewEdit
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        review={selectedReview}
      />
      <ReviewDelete
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        review={selectedReview}
      />
    </div>
  );
}

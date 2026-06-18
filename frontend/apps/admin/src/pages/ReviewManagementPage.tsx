import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { MessageSquare, Star } from "lucide-react";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import TableActionDropdown from "@/components/common/TableActionDropdown";
import TablePagination from "@/components/common/TablePagination";
import { Spinner } from "@repo/ui/components/ui/spinner";

import { Badge } from "@repo/ui/components/ui/badge";

import ReviewEdit from "@/features/reviews/components/ReviewEdit";
import ReviewDelete from "@/features/reviews/components/ReviewDelete";

import { useAllReviews } from "@repo/hooks";
import type { Review } from "@repo/types";

export default function ReviewManagementPage() {
  const { data: reviews = [], isLoading } = useAllReviews();

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const [search, setSearch] = useState("");

  const columns = useMemo<ColumnDef<Review>[]>(
    () => [
      {
        accessorKey: "booking_id",
        header: "Booking ID",
        cell: ({ row }) => (
          <span className="text-sm font-medium">
            #{row.original.booking_id.substring(0, 6)}
          </span>
        ),
      },
      {
        accessorKey: "user_id",
        header: "User ID",
        cell: ({ row }) => (
          <span className="text-sm">
            User #{row.original.user_id.substring(0, 6)}
          </span>
        ),
      },
      {
        accessorKey: "vehicle_id",
        header: "Vehicle ID",
        cell: ({ row }) => (
          <span className="text-sm font-medium">
            Xe #{row.original.vehicle_id.substring(0, 6)}
          </span>
        ),
      },
      {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            {Array.from({ length: row.original.rating }).map((_, index) => (
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
        accessorKey: "created_at",
        header: "Created At",
        cell: ({ row }) =>
          new Date(row.original.created_at).toLocaleString("vi-VN"),
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
      <DataTableToolbar search={search} onSearchChange={setSearch} />

      <DataTable columns={columns} data={reviews} />

      <TablePagination
        page={1}
        pageSize={10}
        totalElements={reviews.length}
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

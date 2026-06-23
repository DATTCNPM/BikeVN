import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";

import DataTable from "@/components/common/DataTable";
import DataTableToolbar from "@/components/common/DataTableToolbar";
import BookingActionDropdown from "@/features/bookings/components/BookingActionDropdown";
import BookingStatusDialog from "@/features/bookings/components/BookingStatusDialog";
import BookingInfoDropdown from "@/features/bookings/components/BookingInfoDropdown";
import TablePagination from "@/components/common/TablePagination";
import { Spinner } from "@repo/ui/components/ui/spinner";

import ReviewCreate from "@/features/reviews/components/ReviewCreate";

import { Badge } from "@repo/ui/components/ui/badge";

import { useBookings } from "@/features/bookings/queries";
import { useBranches } from "@repo/hooks";
import type { Booking } from "@repo/types";

const bookingStatusMap = {
  pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300",
  approved: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  completed:
    "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
  cancelled: "bg-zinc-200 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-300",
};

const bookingStatusLabel = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function BookingManagementPage() {
  const navigate = useNavigate();

  const { data: branches = [], isLoading: isBranchesLoading } = useBranches();

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [dialogMode, setDialogMode] = useState<"approve" | "reject" | null>(
    null,
  );

  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const { data: bookings, isLoading } = useBookings(page, 10);

  const findNameByBranchId = (branchId: string) => {
    const branch = branches.find((b) => b.id === branchId);
    return branch ? branch.name : "Unknown Branch";
  };

  const columns = useMemo<ColumnDef<Booking>[]>(
    () => [
      {
        accessorKey: "user_id",
        header: "Customer",
        cell: ({ row }) => (
          <span className="text-sm font-medium">
            User #{row.original.userId.substring(0, 4)}
          </span>
        ),
      },
      {
        accessorKey: "vehicle_id",
        header: "Vehicle",
        cell: ({ row }) => (
          <span className="text-sm font-medium">
            Xe #{row.original.vehicleId.substring(0, 4)}
          </span>
        ),
      },
      {
        accessorKey: "pickup_branch_id",
        header: "Pickup Branch",
        cell: ({ row }) => (
          <span className="text-sm">
            {findNameByBranchId(row.original.pickupBranchId)}
          </span>
        ),
      },
      {
        accessorKey: "return_branch_id",
        header: "Return Branch",
        cell: ({ row }) => (
          <span className="text-sm">
            {findNameByBranchId(row.original.returnBranchId)}
          </span>
        ),
      },
      {
        id: "info",
        header: "",
        cell: ({ row }) => <BookingInfoDropdown booking={row.original} />,
      },
      {
        accessorKey: "total_price",
        header: "Total Price",
        cell: ({ row }) => `${row.original.totalPrice?.toLocaleString()}đ`,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge className={bookingStatusMap[row.original.status]}>
            {bookingStatusLabel[row.original.status]}
          </Badge>
        ),
      },

      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const booking = row.original;

          return (
            <BookingActionDropdown
              onApprove={() => {
                setSelectedBooking(booking);
                setDialogMode("approve");
              }}
              onReject={() => {
                setSelectedBooking(booking);
                setDialogMode("reject");
              }}
              onManagerVehicleReturn={() =>
                navigate(`/admin/bookings/${booking.id}/return`)
              }
              onCreateReview={() => {
                setSelectedBooking(booking);
                setOpenCreateDialog(true);
              }}
            />
          );
        },
      },
    ],
    [navigate],
  );

  if (isLoading || isBranchesLoading) {
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
        // onCreateOpen={() => setOpenCreateDialog(true)}
      />

      <DataTable columns={columns} data={bookings?.data || []} />

      <TablePagination
        page={bookings?.currentPage || 1}
        totalPages={bookings?.totalPages || 1}
        totalElements={bookings?.totalElements || 0}
        pageSize={bookings?.pageSize || 10}
        onPageChange={setPage}
      />
      <BookingStatusDialog
        booking={selectedBooking}
        open={!!selectedBooking && dialogMode !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedBooking(null);
            setDialogMode(null);
          }
        }}
        mode={dialogMode ?? "approve"}
      />
      {openCreateDialog && (
        <ReviewCreate
          open={openCreateDialog}
          onOpenChange={setOpenCreateDialog}
          bookingId={selectedBooking?.id ?? ""}
        />
      )}
    </div>
  );
}

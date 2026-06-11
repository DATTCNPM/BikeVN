import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";

type Props = {
  page: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export default function TablePagination({
  page,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
}: Props) {
  const startItem = totalElements === 0 ? 0 : (page - 1) * pageSize + 1;

  const endItem = Math.min(page * pageSize, totalElements);

  return (
    <div className="mt-5 flex items-center justify-between rounded-2xl border bg-card px-4 py-3">
      <p className="text-sm text-muted-foreground">
        Hiển thị {startItem}-{endItem} trên {totalElements} bản ghi
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="size-4" />
        </Button>

        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNumber) => (
            <Button
              key={pageNumber}
              variant={pageNumber === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </Button>
          ),
        )}

        <Button
          variant="outline"
          size="icon"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

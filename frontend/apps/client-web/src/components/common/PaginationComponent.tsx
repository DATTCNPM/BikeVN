import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@repo/ui/components/ui/pagination";

import { Label } from "@repo/ui/components/ui/label";

type PaginationComponentProps = {
  page: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
};

export default function PaginationComponent({
  page,
  totalPages,
  totalElements,
  onPageChange,
}: PaginationComponentProps) {
  return (
    <div className="mt-8 space-y-2">
      <p className="text-center text-sm text-muted-foreground">
        Tổng cộng {totalElements} xe
      </p>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              onClick={(e) => {
                e.preventDefault();

                if (page > 1) {
                  onPageChange(page - 1);
                }
              }}
            />
          </PaginationItem>

          <PaginationItem>
            <Label>
              Trang {page} / {totalPages}
            </Label>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              href="#"
              className={
                page >= totalPages ? "pointer-events-none opacity-50" : ""
              }
              onClick={(e) => {
                e.preventDefault();

                if (page < totalPages) {
                  onPageChange(page + 1);
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

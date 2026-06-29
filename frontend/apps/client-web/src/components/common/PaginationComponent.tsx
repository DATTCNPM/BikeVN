import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@repo/ui/components/ui/pagination";

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
    <div className="mt-12 flex flex-col items-center gap-3">
      <Pagination>
        <PaginationContent className="bg-secondary/60 p-1 rounded-full border border-border/30 backdrop-blur-sm">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              className={`rounded-full h-8 w-full p-0 flex items-center justify-center hover:bg-background transition-all ${page <= 1 ? "pointer-events-none opacity-30" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) onPageChange(page - 1);
              }}
            />
          </PaginationItem>

          <PaginationItem className="px-3">
            <span className="text-xs font-semibold text-foreground tracking-tight select-none">
              Page {page} / {totalPages}
            </span>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              href="#"
              className={`rounded-full h-8 w-full p-0 flex items-center justify-center hover:bg-background transition-all ${page >= totalPages ? "pointer-events-none opacity-30" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                if (page < totalPages) onPageChange(page + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <p className="text-[11px] font-medium text-muted-foreground/80 tracking-wide uppercase">
        Total: {totalElements} vehicles
      </p>
    </div>
  );
}

import { Skeleton } from "@repo/ui/components/ui/skeleton";

export default function ListVehiclePageSkeleton() {
  return (
    <div className="space-y-6 w-full animate-pulse">
      {/* 1. SKELETON: SEARCH BAR & FILTERS WRAPPER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border/50 shadow-sm">
        {/* Giả lập ô tìm kiếm SearchComponent */}
        <div className="w-full md:max-w-md space-y-2">
          <Skeleton className="h-10 w-full rounded-xl" />
          <div className="flex justify-between items-center px-1">
            <Skeleton className="h-4 w-28" />
          </div>
        </div>

        {/* Giả lập nút mở UniversalFilterSheet */}
        <Skeleton className="h-10 w-full md:w-32 rounded-xl shrink-0" />
      </div>

      {/* 2. SKELETON: QUICK BRAND CHIPS SELECTOR BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Skeleton className="h-4 w-24 mr-2 shrink-0 rounded" />{" "}
        {/* Label Quick Brands */}
        {/* Giả lập 5 nút Brand Chips tròn */}
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-7 w-20 rounded-full shrink-0" />
        ))}
      </div>

      {/* 3. SKELETON: VEHICLES PRODUCT CARD GRID (Đáp ứng từ 1 đến 5 cột theo màn hình) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col space-y-4 p-4 rounded-2xl border border-border/40 bg-card shadow-sm"
          >
            {/* Giả lập hình ảnh chiếc xe */}
            <Skeleton className="aspect-[4/3] w-full rounded-xl" />

            {/* Giả lập thông tin Tên xe & Biển số */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-5/6 rounded" />
              <Skeleton className="h-4 w-1/2 rounded" />
            </div>

            {/* Giả lập thông số kỹ thuật phụ (Ví dụ: Loại xe, Động cơ...) */}
            <div className="flex items-center gap-2 pt-1">
              <Skeleton className="h-4 w-12 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>

            <hr className="border-border/40" />

            {/* Giả lập Giá thuê & Nút bấm chi tiết dưới đáy Card */}
            <div className="flex items-center justify-between pt-1">
              <div className="space-y-1">
                <Skeleton className="h-3 w-14 rounded" />
                <Skeleton className="h-5 w-24 rounded" />
              </div>
              <Skeleton className="h-9 w-20 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* 4. SKELETON: COMPONENT PAGINATION LAYER */}
      <div className="flex items-center justify-between pt-4 border-t border-border/40">
        <Skeleton className="h-4 w-40 rounded" />
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </div>
  );
}

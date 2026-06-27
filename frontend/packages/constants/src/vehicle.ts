export interface PriceRangeItem {
  label: string;
  value: string;
  min: number;
  max?: number;
}

export const PRICE_RANGES: PriceRangeItem[] = [
  { label: "Below 100k", value: "under-100", min: 0, max: 100000 },
  { label: "100k - 200k", value: "100-200", min: 100000, max: 200000 },
  { label: "Above 200k", value: "over-200", min: 200000, max: undefined },
];

// Bạn có thể bỏ thêm các hằng số liên quan tới vehicle vào đây trong tương lai
export const DEFAULT_VEHICLE_PAGE_SIZE = 10;

// src/apis/data/ReviewData.ts

import type { Review } from "@repo/types";

export const reviews: Review[] = [
  {
    id: "review_1",
    booking_id: "booking_1",
    user_id: "user_1",
    vehicle_id: "1",
    rating: 5,
    comment: "Xe rất sạch và chạy êm",
    created_at: "2026-05-10T08:00:00Z",
    updated_at: "2026-05-10T08:00:00Z",
  },

  {
    id: "review_2",
    booking_id: "booking_2",
    user_id: "user_2",
    vehicle_id: "2",
    rating: 4,
    comment: "Dịch vụ tốt, giao xe đúng giờ",
    created_at: "2026-05-11T09:30:00Z",
    updated_at: "2026-05-11T09:30:00Z",
  },

  {
    id: "review_3",
    booking_id: "booking_3",
    user_id: "user_3",
    vehicle_id: "2",
    rating: 3,
    comment: "Xe ổn nhưng nội thất hơi cũ",
    created_at: "2026-05-12T14:15:00Z",
    updated_at: "2026-05-12T14:15:00Z",
  },

  {
    id: "review_4",
    booking_id: "booking_4",
    user_id: "user_1",
    vehicle_id: "3",
    rating: 5,
    comment: "Trải nghiệm tuyệt vời",
    created_at: "2026-05-13T11:45:00Z",
    updated_at: "2026-05-13T11:45:00Z",
  },

  {
    id: "review_5",
    booking_id: "booking_5",
    user_id: "user_2",
    vehicle_id: "vehicle_2",
    rating: 2,
    comment: "Xe giao hơi trễ",
    created_at: "2026-05-14T16:20:00Z",
    updated_at: "2026-05-14T16:20:00Z",
  },
];

// src/data/VehicleData.ts

import type { Vehicle } from "@repo/types";

export const vehicles: Vehicle[] = [
  {
    id: "1",
    name: "Honda Vision 2024",
    brand: "Honda",
    model: "Vision",
    license_plate: "69A1-12345",
    color: "Black",
    year: 2024,
    price_per_day: 150,
    status: "available",
    engine_capacity: 110,
    fuel_type: "gasoline",
    mileage: 1200,
    image_url: [
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39",
      "https://images.unsplash.com/photo-1517846693594-1567da72af75",
    ],
    description: "Xe tay ga tiết kiệm nhiên liệu",
    current_branch_id: "1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  {
    id: "2",
    name: "Yamaha Exciter 155",
    brand: "Yamaha",
    model: "Exciter",
    license_plate: "69B1-56789",
    color: "Blue",
    year: 2023,
    price_per_day: 220,
    status: "maintenance",
    engine_capacity: 155,
    fuel_type: "gasoline",
    mileage: 5400,
    image_url: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8",
    ],
    description: "Xe côn tay thể thao",
    current_branch_id: "2",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

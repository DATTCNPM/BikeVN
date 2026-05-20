// src/data/BranchData.ts

import type { Branch } from "@repo/types";

export const branches: Branch[] = [
  {
    id: "1",

    name: "Chi nhánh Cà Mau",

    address: "12 Trần Hưng Đạo, Cà Mau",

    lat: 9.1769,

    lng: 105.1524,

    status: "active",

    created_at: new Date().toISOString(),
  },

  {
    id: "2",

    name: "Chi nhánh Hồ Chí Minh",

    address: "45 Nguyễn Huệ, Quận 1",

    lat: 10.7769,

    lng: 106.7009,

    status: "active",

    created_at: new Date().toISOString(),
  },

  {
    id: "3",

    name: "Chi nhánh Cần Thơ",

    address: "88 30/4, Ninh Kiều",

    lat: 10.0452,

    lng: 105.7469,

    status: "inactive",

    created_at: new Date().toISOString(),
  },
];

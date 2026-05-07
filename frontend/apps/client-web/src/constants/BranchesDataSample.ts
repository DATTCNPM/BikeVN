export const branches = [
  {
    id: "1",
    name: "Chi nhánh TP.HCM",
    address: "Quận 1, TP.HCM",
    lat: 10.7769,
    lng: 106.7009,
    status: "active",
    created_at: "2026-05-07 10:00:00",
  },
  {
    id: "2",
    name: "Chi nhánh Cần Thơ",
    address: "Ninh Kiều, Cần Thơ",
    lat: 10.0452,
    lng: 105.7469,
    status: "active",
    created_at: "2026-05-07 10:00:00",
  },
];

export type Branch = (typeof branches)[number];

// userKeys.ts
export const userKeys = {
  all: ["users"] as const,

  // Key đại diện cho các hàm lấy danh sách (ví dụ: userApi.getUsers)
  lists: () => [...userKeys.all, "list"] as const,

  // Key đại diện cho chi tiết 1 user cụ thể (ví dụ: userApi.getUserById)
  detail: (id: string) => [...userKeys.all, "detail", id] as const,
};

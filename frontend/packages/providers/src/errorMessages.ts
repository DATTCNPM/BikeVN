export interface ErrorConfig {
  message: string;
  field?: string; // Tên ô input cần map lỗi vào (nếu có)
}

export const ERROR_MESSAGES: Record<number, ErrorConfig> = {
  // === 9999 & HỆ THỐNG ===
  9999: { message: "System error, please try again later" },

  // === AUTH & USER (1001 -> 1004) ===
  1001: { message: "Invalid key or signature", field: "key" },
  1002: { message: "Email or user already exists", field: "email" },
  1003: { message: "Account does not exist", field: "email" },
  1004: { message: "Incorrect password", field: "password" },

  // === KHÔNG TỒN TẠI (NOT FOUND: 1005 -> 1008) ===
  1005: { message: "Vehicle does not exist", field: "vehicleId" },
  1006: { message: "Brand does not exist", field: "brandId" },
  1007: { message: "Model does not exist", field: "modelId" },
  1008: { message: "Branch does not exist", field: "branchId" },

  // === ĐÃ TỒN TẠI (EXISTED: 1009 -> 1011) ===
  1009: { message: "Branch name already exists", field: "name" },
  1010: { message: "Vehicle model already exists", field: "modelName" },
  1011: { message: "Brand name already exists", field: "brandName" },

  // === FILE & THỜI GIAN (1012 -> 1013) ===
  1012: { message: "File upload failed", field: "file" },
  1013: { message: "Invalid time selected", field: "bookingTime" },

  // === BOOKING & PAYMENT TRÙNG MÃ (1014) ===
  1014: {
    message: "Booking or payment not found, or payment link has expired",
  },

  // === NGHIỆP VỤ ĐẶT XE & THANH TOÁN (1015 -> 1026) ===
  1015: { message: "This booking has already been completed" },
  1016: { message: "This order has already been paid" },
  1017: {
    message: "Vehicle is already booked for this time period",
    field: "bookingTime",
  },
  1018: {
    message: "Vehicle is already locked or unavailable",
    field: "vehicleId",
  },
  1019: { message: "Vehicle lock session not found" },
  1020: { message: "Booking session has expired", field: "bookingTime" },
  1021: { message: "Payment has already been processed" },
  1022: {
    message: "Vehicle is currently not available for rent",
    field: "vehicleId",
  },
  1023: { message: "Return record already exists for this booking" },
  1024: { message: "Comment or review not found" },
  1025: { message: "Invalid amount value", field: "amount" },
  1026: { message: "Conversation not found" },

  // === PHÂN QUYỀN CHUNG (ROLE & PERMISSION: 2000 -> 2003) ===
  2000: { message: "Role not found", field: "roleId" },
  2001: { message: "Permission not found", field: "permissionId" },
  2002: { message: "Role already exists", field: "roleName" },
  2003: { message: "Permission already exists", field: "permissionName" },

  // === BẢO MẬT & XUNG ĐỘT DỮ LIỆU (5050 -> 5555) ===
  5050: { message: "You do not have permission to perform this action" },
  5055: { message: "Data already exists in the system" },
  5555: { message: "Login session has expired or data concurrency conflict" },
};

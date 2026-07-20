export const formatTime = (isoString: string) => {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return ""; // Chuỗi không hợp lệ

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Ép định dạng 24h nếu muốn tránh lẫn lộn AM/PM
    });
  } catch {
    return "";
  }
};

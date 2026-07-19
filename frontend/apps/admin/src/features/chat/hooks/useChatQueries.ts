import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { chatAdminApi } from "../api/chatAdminApi";

export const chatAdminKeys = {
  all: ["chat-admin"] as const,
  conversations: () => [...chatAdminKeys.all, "conversations"] as const,
  history: (conversationId: string) =>
    [...chatAdminKeys.all, "history", conversationId] as const,
};

export function useAdminConversations() {
  return useQuery({
    queryKey: chatAdminKeys.conversations(),
    queryFn: () => chatAdminApi.getMyConversations(),
    staleTime: 1000 * 60 * 3,
  });
}

// Cập nhật Hook sử dụng useInfiniteQuery để phân trang
export function useAdminMessageHistory(conversationId: string, size = 20) {
  return useInfiniteQuery({
    queryKey: chatAdminKeys.history(conversationId),
    queryFn: ({ pageParam = 0 }) =>
      chatAdminApi.getMessageHistory(conversationId, { page: pageParam, size }),
    initialPageParam: 0,
    enabled: !!conversationId,
    staleTime: Infinity,
    // Hàm này xác định trang tiếp theo dựa trên phản hồi của backend (ví dụ: Spring Data Page)
    getNextPageParam: (lastPage) => {
      // Nếu là trang cuối cùng (last === true hoặc không còn phần tử nào nữa), trả về undefined để dừng phân trang
      if (
        lastPage.last ||
        lastPage.empty ||
        !lastPage.content ||
        lastPage.content.length < size
      ) {
        return undefined;
      }
      return lastPage.number + 1; // lastPage.number là số trang hiện tại từ API
    },
  });
}

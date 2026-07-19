import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { chatClientApi } from "../api/chatClientApi"; // File HTTP REST đã tạo ở bước trước

// Key quản lý Cache của React Query
export const chatKeys = {
  all: ["chat"] as const,
  conversations: () => [...chatKeys.all, "conversations"] as const,
  history: (conversationId: string) =>
    [...chatKeys.all, "history", conversationId] as const,
};

// 1. Hook lấy danh sách tất cả cuộc hội thoại của tôi
export function useMyConversations() {
  return useQuery({
    queryKey: chatKeys.conversations(),
    queryFn: () => chatClientApi.getMyConversations(),
    staleTime: 1000 * 60 * 5, // Cache trong 5 phút
  });
}

// 2. Hook lấy lịch sử tin nhắn (Phân trang)
export function useMessageHistory(conversationId: string, size = 20) {
  return useInfiniteQuery({
    queryKey: chatKeys.history(conversationId),
    queryFn: ({ pageParam = 0 }) =>
      chatClientApi.getMessageHistory(conversationId, {
        page: pageParam,
        size,
      }),
    initialPageParam: 0,
    enabled: !!conversationId,
    staleTime: Infinity,
    getNextPageParam: (lastPage: any) => {
      // Xác định xem có trang tiếp theo dựa trên cấu trúc trả về từ backend (ví dụ Spring Boot)
      if (
        lastPage.last ||
        lastPage.empty ||
        !lastPage.content ||
        lastPage.content.length < size
      ) {
        return undefined;
      }
      return lastPage.number + 1;
    },
  });
}

// 3. Hook Mutation: Tạo hoặc lấy phòng chat với Chi Nhánh (Branch)
export function useGetOrCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (branchId: string) =>
      chatClientApi.getOrCreateBranchConversation(branchId),
    onSuccess: () => {
      // Làm mới lại danh sách phòng chat sau khi tạo phòng mới thành công
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
    },
  });
}

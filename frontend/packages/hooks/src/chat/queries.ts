import { useQuery } from "@tanstack/react-query";

import { chatApi } from "@repo/api";

export const useConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: chatApi.getConversations,
  });
};

export const useMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => chatApi.getMessages(conversationId),
    enabled: !!conversationId,
  });
};

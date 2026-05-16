import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { chatApi } from "@repo/api";

import type { SendMessagePayload } from "@repo/schemas";

export const useConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: chatApi.getConversations,
  });
};

export const useMessages = (conversationId: number) => {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => chatApi.getMessages(conversationId),
    enabled: !!conversationId,
  });
};

export const useSendMessage = (conversationId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendMessagePayload) =>
      chatApi.sendMessage(conversationId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", conversationId],
      });

      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });
};

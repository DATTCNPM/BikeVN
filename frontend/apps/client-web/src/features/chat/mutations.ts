import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "@repo/api";

import type { SendMessagePayload } from "@repo/schemas";

export const useSendMessage = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendMessagePayload) =>
      chatApi.sendMessage(conversationId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

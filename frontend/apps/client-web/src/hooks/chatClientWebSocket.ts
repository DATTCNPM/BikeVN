import { TOKEN_KEYS } from "@repo/constants";
import { ChatWebSocketService } from "../../../../packages/services/src/chatWebSocketService";

export const chatClientWebSocket = new ChatWebSocketService({
  tokenKey: TOKEN_KEYS.CLIENT_ACCESS,
  brokerURL: import.meta.env.VITE_WS_URL,
});

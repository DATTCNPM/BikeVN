import { TOKEN_KEYS } from "@repo/constants";
import { ChatWebSocketService } from "../../../../packages/services/src/chatWebSocketService";

export const chatAdminWebSocket = new ChatWebSocketService({
  brokerURL: import.meta.env.VITE_WS_URL,
  tokenKey: TOKEN_KEYS.PORTAL_ACCESS,
});

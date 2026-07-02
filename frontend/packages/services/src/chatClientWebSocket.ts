import { TOKEN_KEYS } from "@repo/constants";
import { ChatWebSocketService } from "./chatWebSocketService";

export const chatClientWebSocket = new ChatWebSocketService({
  tokenKey: TOKEN_KEYS.CLIENT_ACCESS,
});

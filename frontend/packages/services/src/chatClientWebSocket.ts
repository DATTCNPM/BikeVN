import { TOKEN_KEYS } from "@repo/constants";
import { ChatWebSocketService } from "./chatWebSocketService";

export const chatClientWebSocket = new ChatWebSocketService({
  tokenKey: TOKEN_KEYS.CLIENT_ACCESS,
  onMessageReceived: (msg) => console.log("Client received:", msg),
});

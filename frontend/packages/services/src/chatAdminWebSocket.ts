import { TOKEN_KEYS } from "@repo/constants";
import { ChatWebSocketService } from "./chatWebSocketService";

export const chatAdminWebSocket = new ChatWebSocketService({
  tokenKey: TOKEN_KEYS.PORTAL,
  onMessageReceived: (msg) => console.log("Admin received:", msg),
});

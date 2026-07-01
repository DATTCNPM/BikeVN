import { Client, type Message } from "@stomp/stompjs";
import type {
  ChatMessageRequest,
  ChatMessageResponse,
  ReadReceiptEvent,
} from "@repo/types";

type WebSocketConfig = {
  tokenKey: string;
  onMessageReceived?: (message: ChatMessageResponse) => void;
  onReadReceiptReceived?: (event: ReadReceiptEvent) => void;
};

export class ChatWebSocketService {
  private stompClient: Client | null = null;
  private tokenKey: string;
  private currentSubscriptionId: string | null = null;

  constructor(config: WebSocketConfig) {
    this.tokenKey = config.tokenKey;
    this.initStompClient(); // Đã sửa: Không cần truyền config vào đây nữa
  }

  // Đã sửa: Loại bỏ tham số config bị thừa để fix lỗi TS6133
  private initStompClient() {
    // Thay đổi ws:// hoặc wss:// tuỳ theo môi trường của bạn (giống baseURL)
    const socketUrl =
      import.meta.env.VITE_WS_URL || "wss://bikevn.onrender.com/ws";

    this.stompClient = new Client({
      brokerURL: socketUrl,
      connectHeaders: {
        Authorization: localStorage.getItem(this.tokenKey)
          ? `Bearer ${localStorage.getItem(this.tokenKey)}`
          : "",
      },
      debug: (str) => {
        if (import.meta.env.DEV) console.log("[WebSocket Debug]", str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.stompClient.onConnect = () => {
      console.log("Connected to WebSocket Broker");
    };

    this.stompClient.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    };
  }

  // Kích hoạt kết nối
  public activate() {
    this.stompClient?.activate();
  }

  // Ngắt kết nối
  public deactivate() {
    this.unsubscribeCurrentConversation();
    this.stompClient?.deactivate();
  }

  // Đăng ký lắng nghe một phòng chat cụ thể (/topic/conversations/{id})
  public subscribeToConversation(
    conversationId: string,
    onMessageReceived: (message: ChatMessageResponse) => void,
    onReadReceiptReceived?: (event: ReadReceiptEvent) => void,
  ) {
    this.unsubscribeCurrentConversation();

    if (!this.stompClient || !this.stompClient.connected) {
      console.warn("Stomp client is not connected yet.");
      return;
    }

    const destination = `/topic/conversations/${conversationId}`;

    const subscription = this.stompClient.subscribe(
      destination,
      (message: Message) => {
        if (!message.body) return;

        const parsedData = JSON.parse(message.body);

        // Nhận diện payload gửi về là Tin nhắn mới hay Sự kiện đã đọc (Read Receipt)
        if (parsedData.eventType === "READ_RECEIPT") {
          if (onReadReceiptReceived)
            onReadReceiptReceived(parsedData as ReadReceiptEvent);
        } else {
          onMessageReceived(parsedData as ChatMessageResponse);
        }
      },
    );

    this.currentSubscriptionId = subscription.id;
  }

  // Hủy lắng nghe phòng hiện tại khi rời box chat
  public unsubscribeCurrentConversation() {
    if (this.currentSubscriptionId && this.stompClient) {
      this.stompClient.unsubscribe(this.currentSubscriptionId);
      this.currentSubscriptionId = null;
    }
  }

  // Gửi tin nhắn qua WebSocket (/app/chat.sendMessage)
  public sendMessage(payload: ChatMessageRequest) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(payload),
      });
    } else {
      console.error("Cannot send message. WebSocket is not connected.");
    }
  }

  // Đánh dấu đã đọc qua WebSocket (/app/chat.markAsRead)
  public markAsRead(conversationId: string) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: "/app/chat.markAsRead",
        body: conversationId, // Gửi text thuần (String payload) đúng như Backend chỉ định
      });
    }
  }
}

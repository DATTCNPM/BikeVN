import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import type {
  ChatMessageRequest,
  ChatMessageResponse,
  ReadReceiptEvent,
} from "@repo/schemas";

type MessageCallback = (message: ChatMessageResponse) => void;
type ReadReceiptCallback = (event: ReadReceiptEvent) => void;

type WebSocketConfig = {
  tokenKey: string;
  brokerURL?: string;
};

export class ChatWebSocketService {
  private readonly tokenKey: string;

  private readonly stompClient: Client;

  private currentConversationId: string | null = null;

  private currentSubscription: StompSubscription | null = null;

  private onMessageReceived?: MessageCallback;

  private onReadReceiptReceived?: ReadReceiptCallback;

  constructor(config: WebSocketConfig) {
    this.tokenKey = config.tokenKey;

    // Thay đổi: Ưu tiên URL truyền vào cấu hình, nếu không có mới fallback
    const socketUrl = config.brokerURL || "wss://bikevn.onrender.com/ws";

    this.stompClient = new Client({
      brokerURL: socketUrl,

      reconnectDelay: 5000,

      heartbeatIncoming: 4000,

      heartbeatOutgoing: 4000,

      debug: (msg) => {
        if (import.meta.env.DEV) {
          console.log("[WebSocket]", msg);
        }
      },

      beforeConnect: async () => {
        const token = localStorage.getItem(this.tokenKey);

        this.stompClient.connectHeaders = {
          Authorization: token ? `Bearer ${token}` : "",
        };

        if (import.meta.env.DEV) {
          console.log("[WebSocket] CONNECT TOKEN:", token);
        }
      },
    });

    this.stompClient.onConnect = () => {
      console.log("[WebSocket] Connected");

      if (this.currentConversationId) {
        this.subscribeInternal();
      }
    };

    this.stompClient.onDisconnect = () => {
      console.log("[WebSocket] Disconnected");
    };

    this.stompClient.onWebSocketClose = () => {
      console.log("[WebSocket] Socket Closed");
    };

    this.stompClient.onStompError = (frame) => {
      console.error("[WebSocket] Broker Error:", frame.headers["message"]);

      console.error(frame.body);
    };
  }

  /**
   * Chỉ activate đúng một lần.
   */
  public activate() {
    if (this.stompClient.active) return;

    this.stompClient.activate();
  }

  /**
   * Ngắt toàn bộ kết nối.
   */
  public deactivate() {
    this.unsubscribeCurrentConversation();

    if (this.stompClient.active) {
      this.stompClient.deactivate();
    }
  }

  /**
   * Subscribe phòng chat.
   * Nếu socket chưa connect thì sẽ tự subscribe
   * sau khi onConnect được gọi.
   */
  public subscribeToConversation(
    conversationId: string,
    onMessageReceived: MessageCallback,
    onReadReceiptReceived?: ReadReceiptCallback,
  ) {
    this.currentConversationId = conversationId;

    this.onMessageReceived = onMessageReceived;

    this.onReadReceiptReceived = onReadReceiptReceived;

    if (this.stompClient.connected) {
      this.subscribeInternal();
    }
  }

  /**
   * Subscribe thật sự.
   */
  private subscribeInternal() {
    if (!this.currentConversationId) return;

    if (!this.stompClient.connected) return;

    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
      this.currentSubscription = null;
    }

    const destination = `/topic/conversations/${this.currentConversationId}`;

    this.currentSubscription = this.stompClient.subscribe(
      destination,
      (message: IMessage) => {
        if (!message.body) return;

        const payload = JSON.parse(message.body);

        if (payload.eventType === "READ_RECEIPT") {
          this.onReadReceiptReceived?.(payload as ReadReceiptEvent);
          return;
        }

        this.onMessageReceived?.(payload as ChatMessageResponse);
      },
    );

    console.log("[WebSocket] Subscribed:", this.currentConversationId);
  }

  /**
   * Huỷ subscribe hiện tại.
   */
  public unsubscribeCurrentConversation() {
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
      this.currentSubscription = null;
    }

    this.currentConversationId = null;
  }

  /**
   * Gửi tin nhắn.
   */
  public sendMessage(payload: ChatMessageRequest) {
    if (!this.stompClient.connected) {
      console.warn("[WebSocket] Not connected.");
      return;
    }

    this.stompClient.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(payload),
    });
  }

  /**
   * Đánh dấu đã đọc.
   */
  public markAsRead(conversationId: string) {
    if (!this.stompClient.connected) {
      return;
    }

    this.stompClient.publish({
      destination: "/app/chat.markAsRead",
      body: conversationId,
    });
  }
}

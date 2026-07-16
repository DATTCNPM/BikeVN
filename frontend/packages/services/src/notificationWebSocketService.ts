import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import type { NotificationMessage } from "@repo/types"; // Đường dẫn file schema của bạn
import { NotificationMessageSchema } from "@repo/schemas"; // Đường dẫn file schema của bạn

type NotificationCallback = (notification: NotificationMessage) => void;

type WebSocketConfig = {
  tokenKey: string;
};

export class NotificationWebSocketService {
  private readonly tokenKey: string;
  private readonly stompClient: Client;
  private currentBranchId: string | null = null;
  private currentSubscription: StompSubscription | null = null;
  private onNotificationReceived?: NotificationCallback;

  constructor(config: WebSocketConfig) {
    this.tokenKey = config.tokenKey;
    const socketUrl =
      import.meta.env.VITE_WS_URL || "wss://bikevn.onrender.com/ws";

    this.stompClient = new Client({
      brokerURL: socketUrl,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (msg) => {
        if (import.meta.env.DEV) {
          console.log("[NotificationWS]", msg);
        }
      },
      beforeConnect: async () => {
        const token = localStorage.getItem(this.tokenKey);
        this.stompClient.connectHeaders = {
          Authorization: token ? `Bearer ${token}` : "",
        };
      },
    });

    this.stompClient.onConnect = () => {
      console.log("[NotificationWS] Connected");
      if (this.currentBranchId) {
        this.subscribeInternal();
      }
    };
  }

  public activate() {
    if (this.stompClient.active) return;
    this.stompClient.activate();
  }

  public deactivate() {
    this.unsubscribeBranch();
    if (this.stompClient.active) {
      this.stompClient.deactivate();
    }
  }

  /**
   * Đăng ký nhận thông báo theo ID của chi nhánh mà nhân viên/admin đang làm việc
   */
  public subscribeToBranch(
    branchId: string,
    onNotificationReceived: NotificationCallback,
  ) {
    this.currentBranchId = branchId;
    this.onNotificationReceived = onNotificationReceived;

    if (this.stompClient.connected) {
      this.subscribeInternal();
    }
  }

  private subscribeInternal() {
    if (!this.currentBranchId || !this.stompClient.connected) return;

    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
    }

    // Khớp hoàn toàn với BE: /topic/branch/{branchId}/notifications
    const destination = `/topic/branch/${this.currentBranchId}/notifications`;

    this.currentSubscription = this.stompClient.subscribe(
      destination,
      (message: IMessage) => {
        if (!message.body) return;
        try {
          const rawData = JSON.parse(message.body);

          // Validate dữ liệu nhận về qua Zod
          const parsedData = NotificationMessageSchema.parse(rawData);

          this.onNotificationReceived?.(parsedData);
        } catch (error) {
          console.error("[NotificationWS] Parsing/Validation failed:", error);
        }
      },
    );

    console.log("[NotificationWS] Subscribed to branch:", this.currentBranchId);
  }

  public unsubscribeBranch() {
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
      this.currentSubscription = null;
    }
    this.currentBranchId = null;
  }
}

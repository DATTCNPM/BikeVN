import { useMemo, useState } from "react";
import { MessageCircle, Search, SendHorizonal, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  useAdminConversations,
  useAdminMessageHistory,
} from "@/features/chat/useChatQueries";
import { useAdminChatManager } from "@/features/chat/useChatManager";
import { chatMessageRequestSchema } from "@repo/schemas";

import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { Card } from "@repo/ui/components/ui/card";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { cn } from "@repo/ui/lib/utils";

// Định nghĩa Interface mở rộng tại local để bổ sung thuộc tính unreadCount từ Backend
interface AdminConversation {
  id: string;
  title: string;
  branchId?: string | null;
  lastMessageContent?: string | null;
  lastMessageTime?: string | null;
  unreadCount?: number; // Thêm dấu ? để an toàn nếu backend chưa trả về dữ liệu
}

const currentAdminId = "admin-super";

export default function ChatManagementPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Lấy danh sách cuộc hội thoại
  const { data: rawConversations, isLoading: convLoading } =
    useAdminConversations();

  // Ép kiểu dữ liệu (Type Assertion) một cách an toàn để nhận diện thuộc tính unreadCount
  const conversations = useMemo<AdminConversation[]>(() => {
    return (rawConversations || []) as AdminConversation[];
  }, [rawConversations]);

  // 2. Lấy lịch sử tin nhắn
  const { data: messagesData, isLoading: msgLoading } = useAdminMessageHistory(
    selectedId ?? "",
  );

  // 3. Kích hoạt hầm kết nối Realtime WebSocket
  const { sendAdminMessage } = useAdminChatManager(selectedId);

  // Lọc danh sách phòng chat theo ô tìm kiếm
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [conversations, searchTerm]);

  // Lấy ra thông tin chi tiết của phòng chat đang active
  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === selectedId);
  }, [conversations, selectedId]);

  // Trích xuất mảng tin nhắn
  const messages = useMemo(() => {
    return [...(messagesData?.data || [])].reverse();
  }, [messagesData]);

  // Tính toán tổng số tin nhắn chưa đọc
  const totalUnread = useMemo(() => {
    return conversations.reduce(
      (acc, curr) => acc + (curr.unreadCount || 0),
      0,
    );
  }, [conversations]);

  // Cấu hình Form nhập tin nhắn phản hồi
  const { register, handleSubmit, reset } = useForm<{ content: string }>({
    resolver: zodResolver(chatMessageRequestSchema.pick({ content: true })),
    defaultValues: { content: "" },
  });

  const onSend = (data: { content: string }) => {
    sendAdminMessage(data.content);
    reset();
  };

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-6rem)]">
      {/* Topbar: Thanh số liệu thống kê */}
      <div className="flex flex-col gap-4 rounded-3xl border bg-card p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-bold">Workspace Hỗ Trợ Khách Hàng</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Phản hồi trực tuyến các thắc mắc và yêu cầu thuê xe từ hệ thống.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="rounded-xl px-3 py-1 text-xs">
            Tổng số phòng: {conversations.length}
          </Badge>
          {totalUnread > 0 && (
            <Badge className="rounded-xl px-3 py-1 bg-destructive text-destructive-foreground animate-pulse">
              {totalUnread} cuộc gọi mới chờ phản hồi
            </Badge>
          )}
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-12 border bg-card rounded-3xl overflow-hidden shadow-sm flex-1">
        {/* SIDEBAR TRÁI: DANH SÁCH CUỘC HỘI THOẠI */}
        <aside className="col-span-12 md:col-span-4 lg:col-span-3 border-r flex flex-col h-full bg-muted/10">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm tên khách hàng, chi nhánh..."
                className="pl-9 h-10 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-3 space-y-2">
              {convLoading ? (
                <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                  <Spinner />
                  <p className="text-xs mt-2">Đang tải hội thoại...</p>
                </div>
              ) : filteredConversations.length === 0 ? (
                <p className="text-center text-xs text-muted-foreground p-4">
                  Không tìm thấy phòng chat nào.
                </p>
              ) : (
                filteredConversations.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={cn(
                      "w-full rounded-2xl border p-3.5 text-left transition-all flex items-start gap-3 block",
                      "hover:bg-accent/50",
                      item.id === selectedId &&
                        "border-primary/30 bg-primary/10 hover:bg-primary/10",
                    )}
                  >
                    <div className="relative flex-shrink-0">
                      <Avatar className="size-11 border">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                          {item.title.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {item.unreadCount && item.unreadCount > 0 ? (
                        <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                          {item.unreadCount}
                        </span>
                      ) : null}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3
                          className={cn(
                            "truncate text-sm text-foreground",
                            item.unreadCount && item.unreadCount > 0
                              ? "font-bold"
                              : "font-medium",
                          )}
                        >
                          {item.title}
                        </h3>
                      </div>
                      <p
                        className={cn(
                          "mt-1 truncate text-xs",
                          item.unreadCount && item.unreadCount > 0
                            ? "text-foreground font-semibold"
                            : "text-muted-foreground",
                        )}
                      >
                        {item.lastMessageContent || "Chưa có cuộc trò chuyện"}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </aside>

        {/* PHẦN NỘI DUNG PHẢI: KHUNG CHAT CHI TIẾT REALTIME */}
        <section className="col-span-12 md:col-span-8 lg:col-span-9 flex flex-col h-full bg-background">
          {selectedId && activeConversation ? (
            <>
              {/* Header của khung chat */}
              <header className="flex h-16 items-center justify-between border-b px-6 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <Avatar className="size-9 border">
                    <AvatarFallback className="bg-primary/5 text-primary text-xs">
                      <User className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold text-sm">
                      {activeConversation.title}
                    </h2>
                    <p className="text-[11px] text-green-500 flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-green-500 inline-block" />{" "}
                      Đang kết nối hỗ trợ
                    </p>
                  </div>
                </div>
              </header>

              {/* Danh sách các tin nhắn cuộn tròn */}
              <ScrollArea className="flex-1 bg-muted/20">
                <div className="flex flex-col gap-3 p-4">
                  {msgLoading ? (
                    <div className="flex justify-center p-8">
                      <Spinner />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center p-8 text-xs text-muted-foreground">
                      Bắt đầu gửi tin nhắn để mở đầu cuộc trò chuyện.
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.senderId === currentAdminId;
                      return (
                        <div
                          key={msg.id}
                          className={cn(
                            "flex flex-col gap-0.5",
                            isMe ? "items-end" : "items-start",
                          )}
                        >
                          <div
                            className={cn(
                              "flex w-full",
                              isMe ? "justify-end" : "justify-start",
                            )}
                          >
                            <Card
                              className={cn(
                                "max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-none border-none",
                                isMe
                                  ? "bg-primary text-primary-foreground rounded-br-none"
                                  : "bg-card text-foreground rounded-bl-none",
                              )}
                            >
                              <p className="leading-relaxed whitespace-pre-wrap break-all">
                                {msg.content}
                              </p>
                            </Card>
                          </div>
                          <span className="text-[9px] text-muted-foreground px-1">
                            {isMe && (msg.isRead ? "Đã xem" : "Đã gửi")}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>

              {/* Ô input soạn thảo tin nhắn */}
              {/* ĐÃ SỬA: Bọc hàm handleSubmit để tránh lỗi Misused Promise */}
              <form
                onSubmit={(e) => {
                  void handleSubmit(onSend)(e);
                }}
                className="border-t bg-background p-4 flex-shrink-0"
              >
                <div className="flex items-center gap-2 max-w-4xl mx-auto">
                  <Input
                    {...register("content")}
                    placeholder={`Phản hồi lại ${activeConversation.title}...`}
                    className="h-11 rounded-xl"
                    autoComplete="off"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="h-11 w-11 rounded-xl flex-shrink-0"
                  >
                    <SendHorizonal className="size-4" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-muted/5 gap-2 p-4">
              <MessageCircle className="size-12 text-muted-foreground/40 stroke-[1.5]" />
              <h3 className="font-medium text-sm text-foreground">
                Chưa có cuộc trò chuyện nào được chọn
              </h3>
              <p className="text-xs text-center max-w-xs">
                Vui lòng nhấp chọn một tài khoản khách hàng từ danh sách bên
                trái để bắt đầu tiếp nhận hỗ trợ realtime.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

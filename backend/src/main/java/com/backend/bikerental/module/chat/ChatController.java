package com.backend.bikerental.module.chat;

import com.backend.bikerental.core.dto.ApiResponse;
import com.backend.bikerental.core.exception.AppException;
import com.backend.bikerental.core.exception.ErrorCode;
import com.backend.bikerental.module.chat.dto.ChatMessageRequest;
import com.backend.bikerental.module.chat.dto.ChatMessageResponse;
import com.backend.bikerental.module.chat.dto.ConversationResponse;
import com.backend.bikerental.module.chat.dto.ReadReceiptEvent;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ChatController {

    ChatMessageService chatMessageService;
    SimpMessagingTemplate messagingTemplate;

    /**
     * Frontend sẽ gửi tin nhắn vào địa chỉ: /app/chat.sendMessage
     */
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessageRequest request, Authentication authentication) {

        String senderEmail = authentication.getName();
        log.info("received message from user: {} - Content: {}", senderEmail, request.getContent());

        // check permission before send message
        boolean hasAccess = chatMessageService.checkConversationAccess(senderEmail, request.getConversationId());
        if (!hasAccess) {
            log.error("WebSocket Send Denied: User {} has no access to conversation {}", senderEmail, request.getConversationId());
            return;
        }

        ChatMessageResponse savedMessage = chatMessageService.saveMessage(request, senderEmail);

        // 3. Định tuyến tin nhắn đến ĐÚNG cuộc hội thoại
        // Frontend của người nhận (và cả người gửi) phải subscribe (đăng ký) vào kênh này để nghe:
        // /topic/conversations/{conversationId}
        String destination = "/topic/conversations/" + request.getConversationId();

        // Bắn tin nhắn đã lưu (kèm thời gian, id...) xuống cho tất cả những người đang mở box chat đó
        messagingTemplate.convertAndSend(destination, savedMessage);
    }

    @PostMapping("/conversations/branch/{branchId}")
    public ApiResponse<ConversationResponse> getOrCreateBranchConversation(
            @PathVariable String branchId,
            Authentication authentication) {
        String email = authentication.getName();
        return ApiResponse.<ConversationResponse>builder()
                .result(chatMessageService.getOrCreateBranchConversation(email, branchId))
                .build();
    }

    @GetMapping("/{conversationId}")
    public ApiResponse<Page<ChatMessageResponse>> getMessageHistory(
            @PathVariable String conversationId,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            Authentication authentication) {

        String email = authentication.getName();
        boolean hasAccess = chatMessageService.checkConversationAccess(email, conversationId);
        if (!hasAccess) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        return ApiResponse.<Page<ChatMessageResponse>>builder()
                .result(chatMessageService.getMessageHistory(conversationId, pageable))
                .build();
    }

    @GetMapping("/conversations")
    public ApiResponse<List<ConversationResponse>> getMyConversations(Authentication authentication) {
        String email = authentication.getName();
        return ApiResponse.<List<ConversationResponse>>builder()
                .result(chatMessageService.getConversationsByUserId(email))
                .build();
    }

    @MessageMapping("/chat.markAsRead")
    public void markAsRead(@Payload String conversationId, Authentication authentication) {
        String email = authentication.getName();

        boolean hasAccess = chatMessageService.checkConversationAccess(email, conversationId);
        if (!hasAccess) {
            log.error("WebSocket MarkAsRead Denied: User {} has no access to conversation {}", email, conversationId);
            return;
        }

        chatMessageService.markMessagesAsRead(conversationId, email);

        // 2. Thông báo cho đối phương biết tin nhắn đã được đọc
        // Gửi event này vào kênh của cuộc hội thoại để Frontend người kia cập nhật UI
        String destination = "/topic/conversations/" + conversationId;
        messagingTemplate.convertAndSend(destination, new ReadReceiptEvent(conversationId, email, "READ_RECEIPT"));
    }
}
package com.backend.bikerental.module.chat;

import com.backend.bikerental.core.exception.AppException;
import com.backend.bikerental.core.exception.ErrorCode;
import com.backend.bikerental.module.chat.dto.ChatMessageRequest;
import com.backend.bikerental.module.chat.dto.ChatMessageResponse;
import com.backend.bikerental.module.chat.dto.ConversationResponse;
import com.backend.bikerental.module.branch.Branch;
import com.backend.bikerental.module.branch.BranchRepository;
import com.backend.bikerental.module.user.User;
import com.backend.bikerental.module.user.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional
public class ChatMessageService {
     ConversationRepository conversationRepository;
     MessageRepository messageRepository;
     UserRepository userRepository;
     BranchRepository branchRepository;

    public ChatMessageResponse saveMessage(ChatMessageRequest request, String senderEmail) {
        User user = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Conversation conversation = conversationRepository.findById(request.getConversationId())
                .orElseThrow(() -> new AppException(ErrorCode.CONVERSATION_NOT_FOUND));

        Message message = Message.builder()
                .conversation(conversation)
                .senderId(user.getId())
                .content(request.getContent())
                .isRead(false)
                .build();

        Message saved = messageRepository.save(message);

        return ChatMessageResponse.builder()
                .id(saved.getId())
                .senderId(saved.getSenderId())
                .content(saved.getContent())
                .isRead(saved.getIsRead())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    public Page<ChatMessageResponse> getMessageHistory(String conversationId, Pageable pageable)
    {
        return messageRepository.findByConversationIdOrderByCreatedAtDesc(conversationId, pageable)
                .map(message -> ChatMessageResponse.builder()
                        .id(message.getId())
                        .senderId(message.getSenderId())
                        .content(message.getContent())
                        .isRead(message.getIsRead())
                        .createdAt(message.getCreatedAt())
                        .build());
    }

    public ConversationResponse getOrCreateBranchConversation(String customerEmail, String branchId) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));

        Conversation conversation = conversationRepository.findByBranchIdAndCustomerId(branchId, customer.getId())
                .orElseGet(() -> {
                    Conversation newConv = Conversation.builder()
                            .branch(branch)
                            .build();

                    ConversationMember member = ConversationMember.builder()
                            .conversation(newConv)
                            .userId(customer.getId())
                            .build();

                    newConv.setMembers(java.util.Set.of(member));
                    return conversationRepository.save(newConv);
                });

        Message lastMessage = messageRepository
                .findFirstByConversationIdOrderByCreatedAtDesc(conversation.getId());

        return ConversationResponse.builder()
                .id(conversation.getId())
                .title(branch.getName())
                .branchId(branchId)
                .lastMessageContent(lastMessage != null ? lastMessage.getContent() : "No message yet!")
                .lastMessageTime(lastMessage != null ? lastMessage.getCreatedAt() : conversation.getCreatedAt())
                .build();
    }

    public List<ConversationResponse> getConversationsByUserId(String email)
    {
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        boolean isStaff = currentUser.getRoles().stream()
                .anyMatch(role -> "employee".equalsIgnoreCase(role.getName()) 
                        || "manager".equalsIgnoreCase(role.getName()) 
                        || "admin".equalsIgnoreCase(role.getName()));

        List<Conversation> conversations;
        if (isStaff && currentUser.getBranch() != null) {
            conversations = conversationRepository.findByBranchId(currentUser.getBranch().getId());
        } else {
            conversations = conversationRepository.findByUserId(currentUser.getId());
        }

        return conversations.stream().map(conversation -> {
            Message lastMessage = messageRepository
                    .findFirstByConversationIdOrderByCreatedAtDesc(conversation.getId());

            String title = "Chat Room";
            if (conversation.getBranch() != null) {
                if (isStaff) {
                    if (conversation.getMembers() != null && !conversation.getMembers().isEmpty()) {
                        String customerId = conversation.getMembers().iterator().next().getUserId();
                        title = userRepository.findById(customerId).map(User::getName).orElse("Customer");
                    }
                } else {
                    title = conversation.getBranch().getName();
                }
            }

            return ConversationResponse.builder()
                    .id(conversation.getId())
                    .title(title)
                    .branchId(conversation.getBranch() != null ? conversation.getBranch().getId() : null)
                    .lastMessageContent(lastMessage != null ? lastMessage.getContent() : "No message yet!")
                    .lastMessageTime(lastMessage != null ? lastMessage.getCreatedAt() : conversation.getCreatedAt())
                    .build();
        }).collect(Collectors.toList());
    }

    public void markMessagesAsRead(String conversationId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        messageRepository.markMessagesAsRead(conversationId, user.getId());
    }

    public boolean checkConversationAccess(String email, String conversationId) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return false;

        Conversation conversation = conversationRepository.findById(conversationId).orElse(null);
        if (conversation == null) return false;

        boolean isStaff = user.getRoles().stream()
                .anyMatch(role -> "employee".equalsIgnoreCase(role.getName()) 
                        || "manager".equalsIgnoreCase(role.getName()) 
                        || "admin".equalsIgnoreCase(role.getName()));

        if (isStaff) {
            return conversation.getBranch() != null 
                    && user.getBranch() != null 
                    && conversation.getBranch().getId().equals(user.getBranch().getId());
        } else {
            if (conversation.getMembers() == null) return false;
            return conversation.getMembers().stream()
                    .anyMatch(member -> user.getId().equals(member.getUserId()));
        }
    }
}
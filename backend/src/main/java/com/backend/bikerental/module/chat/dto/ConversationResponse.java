package com.backend.bikerental.module.chat.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ConversationResponse {
    String id;
    String title;
    String branchId;
    String lastMessageContent;
    LocalDateTime lastMessageTime;
}

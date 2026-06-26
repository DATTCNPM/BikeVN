package com.backend.bikerental.module.chat.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatMessageResponse {
    String id;
    String senderId;
    String content;
    Boolean isRead;
    LocalDateTime createdAt;
}
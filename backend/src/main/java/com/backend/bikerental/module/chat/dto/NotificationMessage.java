package com.backend.bikerental.module.chat.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationMessage {
    String type;
    String branchId;
    String title;
    String content;
    String referenceId;
    @Builder.Default
    LocalDateTime timestamp = LocalDateTime.now();
}

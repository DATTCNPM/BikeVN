package com.backend.bikerental.module.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReadReceiptEvent {
    String conversationId;
    String readerId;
    String eventType = "READ_RECEIPT";
}
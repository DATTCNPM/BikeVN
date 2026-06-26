package com.backend.bikerental.module.chat;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36, nullable = false, updatable = false)
    String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    Conversation conversation;

    @Column(length = 36, nullable = false)
    String senderId;

    @Column(columnDefinition = "TEXT", nullable = false)
    String content;

    @Column(columnDefinition = "TiNYINT(1) DEFAULT 0")
    Boolean isRead;

    @CreationTimestamp
    @Column(updatable = false)
    LocalDateTime createdAt;
}

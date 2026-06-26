package com.backend.bikerental.module.chat;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface MessageRepository extends JpaRepository<Message, String> {
    Page<Message> findByConversationIdOrderByCreatedAtDesc(String conversationId, Pageable pageable);
    Message findFirstByConversationIdOrderByCreatedAtDesc(String conversationId);

    @Transactional
    @Modifying
    @Query("UPDATE Message m SET m.isRead = true " +
            "WHERE m.conversation.id = :convId " +
            "AND m.senderId != :userId " +
            "AND m.isRead = false")
    void markMessagesAsRead(@Param("convId") String convId, @Param("userId") String userId);
}

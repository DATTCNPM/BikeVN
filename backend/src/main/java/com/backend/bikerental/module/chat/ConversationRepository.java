package com.backend.bikerental.module.chat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, String> {
    @Query("SELECT c FROM Conversation c " +
            "JOIN ConversationMember cm ON " +
            "c.id = cm.conversation.id " +
            "WHERE cm.userId = :userId")
    List<Conversation> findByUserId(@Param("userId") String userId);
}

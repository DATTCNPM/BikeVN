package com.backend.bikerental.module.chat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, String> {
    @Query("SELECT c FROM Conversation c " +
            "JOIN ConversationMember cm ON " +
            "c.id = cm.conversation.id " +
            "WHERE cm.userId = :userId")
    List<Conversation> findByUserId(@Param("userId") String userId);

    List<Conversation> findByBranchId(String branchId);

    @Query("SELECT c FROM Conversation c WHERE c.branch.id = :branchId AND EXISTS " +
           "(SELECT cm FROM ConversationMember cm WHERE cm.conversation.id = c.id AND cm.userId = :customerId)")
    Optional<Conversation> findByBranchIdAndCustomerId(@Param("branchId") String branchId, @Param("customerId") String customerId);
}

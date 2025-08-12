package com.hrm.system.repository;

import com.hrm.system.entity.FeedbackRequest;
import com.hrm.system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRequestRepository extends JpaRepository<FeedbackRequest, Long> {
    
    // Find all feedback requests where the user is the recipient
    List<FeedbackRequest> findByRecipientOrderByCreatedAtDesc(User recipient);
    
    // Find all feedback requests where the user is the requester
    List<FeedbackRequest> findByRequesterOrderByCreatedAtDesc(User requester);
    
    // Find feedback requests by status
    List<FeedbackRequest> findByStatus(FeedbackRequest.FeedbackRequestStatus status);
    
    // Find feedback requests by recipient and status
    List<FeedbackRequest> findByRecipientAndStatusOrderByCreatedAtDesc(User recipient, FeedbackRequest.FeedbackRequestStatus status);
    
    // Find feedback requests by requester and status
    List<FeedbackRequest> findByRequesterAndStatusOrderByCreatedAtDesc(User requester, FeedbackRequest.FeedbackRequestStatus status);
    
    // Find pending feedback requests for a recipient
    @Query("SELECT fr FROM FeedbackRequest fr WHERE fr.recipient = :recipient AND fr.status = 'PENDING' ORDER BY fr.createdAt DESC")
    List<FeedbackRequest> findPendingRequestsForRecipient(@Param("recipient") User recipient);

    // Remove if needed: Spring JPA save updates status. No explicit delete used here.
    
    // Find pending feedback requests from a requester
    @Query("SELECT fr FROM FeedbackRequest fr WHERE fr.requester = :requester AND fr.status = 'PENDING' ORDER BY fr.createdAt DESC")
    List<FeedbackRequest> findPendingRequestsFromRequester(@Param("requester") User requester);
    
    // Count pending feedback requests for a recipient
    @Query("SELECT COUNT(fr) FROM FeedbackRequest fr WHERE fr.recipient = :recipient AND fr.status = 'PENDING'")
    long countPendingRequestsForRecipient(@Param("recipient") User recipient);
}

package com.hrm.system.repository;

import com.hrm.system.entity.AISuggestion;
import com.hrm.system.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AISuggestionRepository extends JpaRepository<AISuggestion, Long> {
    
    // Find suggestions by user
    List<AISuggestion> findByUserOrderByCreatedAtDesc(User user);
    
    // Find suggestions by status
    List<AISuggestion> findByStatus(AISuggestion.SuggestionStatus status);
    
    // Find suggestions by user and status
    List<AISuggestion> findByUserAndStatus(User user, AISuggestion.SuggestionStatus status);
    
    // Find suggestions by category
    List<AISuggestion> findByCategory(AISuggestion.SuggestionCategory category);
    
    // Find suggestions by user and category
    List<AISuggestion> findByUserAndCategory(User user, AISuggestion.SuggestionCategory category);
    
    // Find suggestions by priority
    List<AISuggestion> findByPriority(AISuggestion.SuggestionPriority priority);
    
    // Find suggestions by user and priority
    List<AISuggestion> findByUserAndPriority(User user, AISuggestion.SuggestionPriority priority);
    
    // Find suggestions by type
    List<AISuggestion> findByType(AISuggestion.SuggestionType type);
    
    // Find suggestions by user and type
    List<AISuggestion> findByUserAndType(User user, AISuggestion.SuggestionType type);
    
    // Find suggestions with pagination
    Page<AISuggestion> findByUser(User user, Pageable pageable);
    
    // Find active suggestions
    @Query("SELECT a FROM AISuggestion a WHERE a.status = 'ACTIVE'")
    List<AISuggestion> findActiveSuggestions();
    
    // Find active suggestions for a user
    @Query("SELECT a FROM AISuggestion a WHERE a.user = :user AND a.status = 'ACTIVE'")
    List<AISuggestion> findActiveSuggestionsForUser(@Param("user") User user);
    
    // Find high-priority suggestions
    @Query("SELECT a FROM AISuggestion a WHERE a.priority = 'HIGH' AND a.status = 'ACTIVE'")
    List<AISuggestion> findHighPrioritySuggestions();
    
    // Find high-priority suggestions for a user
    @Query("SELECT a FROM AISuggestion a WHERE a.user = :user AND a.priority = 'HIGH' AND a.status = 'ACTIVE'")
    List<AISuggestion> findHighPrioritySuggestionsForUser(@Param("user") User user);
    
    // Find suggestions by department (for managers)
    @Query("SELECT a FROM AISuggestion a WHERE a.user.department = :department")
    List<AISuggestion> findByDepartment(@Param("department") User.Department department);
    
    // Find active suggestions by department
    @Query("SELECT a FROM AISuggestion a WHERE a.user.department = :department AND a.status = 'ACTIVE'")
    List<AISuggestion> findActiveSuggestionsByDepartment(@Param("department") User.Department department);
    
    // Find suggestions by department and category
    @Query("SELECT a FROM AISuggestion a WHERE a.user.department = :department AND a.category = :category")
    List<AISuggestion> findByDepartmentAndCategory(@Param("department") User.Department department, @Param("category") AISuggestion.SuggestionCategory category);
    
    // Find suggestions by department and priority
    @Query("SELECT a FROM AISuggestion a WHERE a.user.department = :department AND a.priority = :priority")
    List<AISuggestion> findByDepartmentAndPriority(@Param("department") User.Department department, @Param("priority") AISuggestion.SuggestionPriority priority);
    
    // Count suggestions by status for a user
    long countByUserAndStatus(User user, AISuggestion.SuggestionStatus status);
    
    // Count suggestions by category for a user
    long countByUserAndCategory(User user, AISuggestion.SuggestionCategory category);
    
    // Count suggestions by priority for a user
    long countByUserAndPriority(User user, AISuggestion.SuggestionPriority priority);
    
    // Count suggestions by status for a department
    @Query("SELECT COUNT(a) FROM AISuggestion a WHERE a.user.department = :department AND a.status = :status")
    long countByDepartmentAndStatus(@Param("department") User.Department department, @Param("status") AISuggestion.SuggestionStatus status);
    
    // Count suggestions by category for a department
    @Query("SELECT COUNT(a) FROM AISuggestion a WHERE a.user.department = :department AND a.category = :category")
    long countByDepartmentAndCategory(@Param("department") User.Department department, @Param("category") AISuggestion.SuggestionCategory category);
    
    // Find implemented suggestions
    @Query("SELECT a FROM AISuggestion a WHERE a.status = 'IMPLEMENTED'")
    List<AISuggestion> findImplementedSuggestions();
    
    // Find implemented suggestions for a user
    @Query("SELECT a FROM AISuggestion a WHERE a.user = :user AND a.status = 'IMPLEMENTED'")
    List<AISuggestion> findImplementedSuggestionsForUser(@Param("user") User user);
    
    // Find dismissed suggestions
    @Query("SELECT a FROM AISuggestion a WHERE a.status = 'DISMISSED'")
    List<AISuggestion> findDismissedSuggestions();
    
    // Find dismissed suggestions for a user
    @Query("SELECT a FROM AISuggestion a WHERE a.user = :user AND a.status = 'DISMISSED'")
    List<AISuggestion> findDismissedSuggestionsForUser(@Param("user") User user);
    
    // Find suggestions with high AI confidence score
    @Query("SELECT a FROM AISuggestion a WHERE a.aiScore >= 0.8")
    List<AISuggestion> findHighConfidenceSuggestions();
    
    // Find suggestions with high AI confidence score for a user
    @Query("SELECT a FROM AISuggestion a WHERE a.user = :user AND a.aiScore >= 0.8")
    List<AISuggestion> findHighConfidenceSuggestionsForUser(@Param("user") User user);
    
    // Find suggestions by AI score range
    @Query("SELECT a FROM AISuggestion a WHERE a.aiScore BETWEEN :minScore AND :maxScore")
    List<AISuggestion> findByAiScoreRange(@Param("minScore") Double minScore, @Param("maxScore") Double maxScore);
    
    // Find suggestions by AI score range for a user
    @Query("SELECT a FROM AISuggestion a WHERE a.user = :user AND a.aiScore BETWEEN :minScore AND :maxScore")
    List<AISuggestion> findByAiScoreRangeForUser(@Param("user") User user, @Param("minScore") Double minScore, @Param("maxScore") Double maxScore);
    
    // Find recent suggestions (last 30 days)
    @Query("SELECT a FROM AISuggestion a WHERE a.createdAt >= CURRENT_DATE")
    List<AISuggestion> findRecentSuggestions();
    
    // Find recent suggestions for a user
    @Query("SELECT a FROM AISuggestion a WHERE a.user = :user AND a.createdAt >= CURRENT_DATE")
    List<AISuggestion> findRecentSuggestionsForUser(@Param("user") User user);
} 
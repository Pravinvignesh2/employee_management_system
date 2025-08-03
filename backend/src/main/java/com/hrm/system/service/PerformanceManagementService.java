package com.hrm.system.service;

import com.hrm.system.dto.*;
import com.hrm.system.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface PerformanceManagementService {
    
    // Performance Goals
    PerformanceGoalDto createGoal(PerformanceGoalDto goalDto, User currentUser);
    PerformanceGoalDto updateGoal(Long goalId, PerformanceGoalDto goalDto, User currentUser);
    PerformanceGoalDto getGoalById(Long goalId, User currentUser);
    List<PerformanceGoalDto> getGoalsByUser(Long userId, User currentUser);
    List<PerformanceGoalDto> getGoalsByDepartment(String department, User currentUser);
    List<PerformanceGoalDto> getAllGoals(User currentUser);
    void deleteGoal(Long goalId, User currentUser);
    Map<String, Object> getGoalStatistics(User currentUser);
    
    // Feedback
    FeedbackDto createFeedback(FeedbackDto feedbackDto, User currentUser);
    FeedbackDto updateFeedback(Long feedbackId, FeedbackDto feedbackDto, User currentUser);
    FeedbackDto getFeedbackById(Long feedbackId, User currentUser);
    List<FeedbackDto> getFeedbackByRecipient(Long recipientId, User currentUser);
    List<FeedbackDto> getFeedbackByReviewer(Long reviewerId, User currentUser);
    List<FeedbackDto> getFeedbackByDepartment(String department, User currentUser);
    List<FeedbackDto> getAllFeedback(User currentUser);
    void deleteFeedback(Long feedbackId, User currentUser);
    Map<String, Object> getFeedbackStatistics(User currentUser);
    
    // Appraisals
    AppraisalDto createAppraisal(AppraisalDto appraisalDto, User currentUser);
    AppraisalDto updateAppraisal(Long appraisalId, AppraisalDto appraisalDto, User currentUser);
    AppraisalDto getAppraisalById(Long appraisalId, User currentUser);
    List<AppraisalDto> getAppraisalsByEmployee(Long employeeId, User currentUser);
    List<AppraisalDto> getAppraisalsByManager(Long managerId, User currentUser);
    List<AppraisalDto> getAppraisalsByDepartment(String department, User currentUser);
    List<AppraisalDto> getAllAppraisals(User currentUser);
    void deleteAppraisal(Long appraisalId, User currentUser);
    Map<String, Object> getAppraisalStatistics(User currentUser);
    
    // AI Suggestions
    AISuggestionDto createSuggestion(AISuggestionDto suggestionDto, User currentUser);
    AISuggestionDto updateSuggestion(Long suggestionId, AISuggestionDto suggestionDto, User currentUser);
    AISuggestionDto getSuggestionById(Long suggestionId, User currentUser);
    List<AISuggestionDto> getSuggestionsByUser(Long userId, User currentUser);
    List<AISuggestionDto> getSuggestionsByDepartment(String department, User currentUser);
    List<AISuggestionDto> getAllSuggestions(User currentUser);
    void deleteSuggestion(Long suggestionId, User currentUser);
    AISuggestionDto implementSuggestion(Long suggestionId, String notes, User currentUser);
    AISuggestionDto dismissSuggestion(Long suggestionId, User currentUser);
    Map<String, Object> getSuggestionStatistics(User currentUser);
    
    // Reports and Analytics
    Map<String, Object> getPerformanceReport(String department, String period, User currentUser);
    Map<String, Object> getTeamPerformanceReport(Long managerId, String period, User currentUser);
    Map<String, Object> getCompanyWidePerformanceReport(String period, User currentUser);
    
    // Utility methods
    boolean hasAccessToUser(Long targetUserId, User currentUser);
    boolean hasAccessToDepartment(String department, User currentUser);
    List<String> getAccessibleDepartments(User currentUser);
} 
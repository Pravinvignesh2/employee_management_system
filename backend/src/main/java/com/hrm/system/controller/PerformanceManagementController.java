package com.hrm.system.controller;

import com.hrm.system.dto.*;
import com.hrm.system.entity.User;
import com.hrm.system.service.PerformanceManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/performance")
@CrossOrigin(origins = "*")
public class PerformanceManagementController {
    
    @Autowired
    private PerformanceManagementService performanceManagementService;
    
    // Helper method to get current user
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }
    
    // ==================== PERFORMANCE GOALS ====================
    
    @PostMapping("/goals")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<PerformanceGoalDto> createGoal(@RequestBody PerformanceGoalDto goalDto) {
        try {
            User currentUser = getCurrentUser();
            PerformanceGoalDto createdGoal = performanceManagementService.createGoal(goalDto, currentUser);
            return ResponseEntity.ok(createdGoal);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/goals/{goalId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<PerformanceGoalDto> updateGoal(@PathVariable Long goalId, @RequestBody PerformanceGoalDto goalDto) {
        try {
            User currentUser = getCurrentUser();
            PerformanceGoalDto updatedGoal = performanceManagementService.updateGoal(goalId, goalDto, currentUser);
            return ResponseEntity.ok(updatedGoal);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/goals/{goalId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<PerformanceGoalDto> getGoalById(@PathVariable Long goalId) {
        try {
            User currentUser = getCurrentUser();
            PerformanceGoalDto goal = performanceManagementService.getGoalById(goalId, currentUser);
            return ResponseEntity.ok(goal);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/goals/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<List<PerformanceGoalDto>> getGoalsByUser(@PathVariable Long userId) {
        try {
            User currentUser = getCurrentUser();
            List<PerformanceGoalDto> goals = performanceManagementService.getGoalsByUser(userId, currentUser);
            return ResponseEntity.ok(goals);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/goals/department/{department}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<PerformanceGoalDto>> getGoalsByDepartment(@PathVariable String department) {
        try {
            User currentUser = getCurrentUser();
            List<PerformanceGoalDto> goals = performanceManagementService.getGoalsByDepartment(department, currentUser);
            return ResponseEntity.ok(goals);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/goals")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PerformanceGoalDto>> getAllGoals() {
        try {
            User currentUser = getCurrentUser();
            List<PerformanceGoalDto> goals = performanceManagementService.getAllGoals(currentUser);
            return ResponseEntity.ok(goals);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/goals/{goalId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long goalId) {
        try {
            User currentUser = getCurrentUser();
            performanceManagementService.deleteGoal(goalId, currentUser);
            return ResponseEntity.ok().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/goals/statistics")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<Map<String, Object>> getGoalStatistics() {
        try {
            User currentUser = getCurrentUser();
            Map<String, Object> statistics = performanceManagementService.getGoalStatistics(currentUser);
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // ==================== FEEDBACK ====================
    
    @PostMapping("/feedback")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<FeedbackDto> createFeedback(@RequestBody FeedbackDto feedbackDto) {
        try {
            User currentUser = getCurrentUser();
            FeedbackDto createdFeedback = performanceManagementService.createFeedback(feedbackDto, currentUser);
            return ResponseEntity.ok(createdFeedback);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/feedback/{feedbackId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<FeedbackDto> updateFeedback(@PathVariable Long feedbackId, @RequestBody FeedbackDto feedbackDto) {
        try {
            User currentUser = getCurrentUser();
            FeedbackDto updatedFeedback = performanceManagementService.updateFeedback(feedbackId, feedbackDto, currentUser);
            return ResponseEntity.ok(updatedFeedback);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/feedback/{feedbackId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<FeedbackDto> getFeedbackById(@PathVariable Long feedbackId) {
        try {
            User currentUser = getCurrentUser();
            FeedbackDto feedback = performanceManagementService.getFeedbackById(feedbackId, currentUser);
            return ResponseEntity.ok(feedback);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/feedback/recipient/{recipientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<List<FeedbackDto>> getFeedbackByRecipient(@PathVariable Long recipientId) {
        try {
            User currentUser = getCurrentUser();
            List<FeedbackDto> feedbacks = performanceManagementService.getFeedbackByRecipient(recipientId, currentUser);
            return ResponseEntity.ok(feedbacks);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/feedback/reviewer/{reviewerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<List<FeedbackDto>> getFeedbackByReviewer(@PathVariable Long reviewerId) {
        try {
            User currentUser = getCurrentUser();
            List<FeedbackDto> feedbacks = performanceManagementService.getFeedbackByReviewer(reviewerId, currentUser);
            return ResponseEntity.ok(feedbacks);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/feedback/department/{department}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<FeedbackDto>> getFeedbackByDepartment(@PathVariable String department) {
        try {
            User currentUser = getCurrentUser();
            List<FeedbackDto> feedbacks = performanceManagementService.getFeedbackByDepartment(department, currentUser);
            return ResponseEntity.ok(feedbacks);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/feedback")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FeedbackDto>> getAllFeedback() {
        try {
            User currentUser = getCurrentUser();
            List<FeedbackDto> feedbacks = performanceManagementService.getAllFeedback(currentUser);
            return ResponseEntity.ok(feedbacks);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/feedback/{feedbackId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long feedbackId) {
        try {
            User currentUser = getCurrentUser();
            performanceManagementService.deleteFeedback(feedbackId, currentUser);
            return ResponseEntity.ok().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/feedback/statistics")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<Map<String, Object>> getFeedbackStatistics() {
        try {
            User currentUser = getCurrentUser();
            Map<String, Object> statistics = performanceManagementService.getFeedbackStatistics(currentUser);
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // ==================== APPRAISALS ====================
    
    @PostMapping("/appraisals")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<AppraisalDto> createAppraisal(@RequestBody AppraisalDto appraisalDto) {
        try {
            User currentUser = getCurrentUser();
            AppraisalDto createdAppraisal = performanceManagementService.createAppraisal(appraisalDto, currentUser);
            return ResponseEntity.ok(createdAppraisal);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/appraisals/{appraisalId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<AppraisalDto> updateAppraisal(@PathVariable Long appraisalId, @RequestBody AppraisalDto appraisalDto) {
        try {
            User currentUser = getCurrentUser();
            AppraisalDto updatedAppraisal = performanceManagementService.updateAppraisal(appraisalId, appraisalDto, currentUser);
            return ResponseEntity.ok(updatedAppraisal);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/appraisals/{appraisalId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<AppraisalDto> getAppraisalById(@PathVariable Long appraisalId) {
        try {
            User currentUser = getCurrentUser();
            AppraisalDto appraisal = performanceManagementService.getAppraisalById(appraisalId, currentUser);
            return ResponseEntity.ok(appraisal);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/appraisals/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<List<AppraisalDto>> getAppraisalsByEmployee(@PathVariable Long employeeId) {
        try {
            User currentUser = getCurrentUser();
            List<AppraisalDto> appraisals = performanceManagementService.getAppraisalsByEmployee(employeeId, currentUser);
            return ResponseEntity.ok(appraisals);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/appraisals/manager/{managerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<AppraisalDto>> getAppraisalsByManager(@PathVariable Long managerId) {
        try {
            User currentUser = getCurrentUser();
            List<AppraisalDto> appraisals = performanceManagementService.getAppraisalsByManager(managerId, currentUser);
            return ResponseEntity.ok(appraisals);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/appraisals/department/{department}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<AppraisalDto>> getAppraisalsByDepartment(@PathVariable String department) {
        try {
            User currentUser = getCurrentUser();
            List<AppraisalDto> appraisals = performanceManagementService.getAppraisalsByDepartment(department, currentUser);
            return ResponseEntity.ok(appraisals);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/appraisals")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AppraisalDto>> getAllAppraisals() {
        try {
            User currentUser = getCurrentUser();
            List<AppraisalDto> appraisals = performanceManagementService.getAllAppraisals(currentUser);
            return ResponseEntity.ok(appraisals);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/appraisals/{appraisalId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAppraisal(@PathVariable Long appraisalId) {
        try {
            User currentUser = getCurrentUser();
            performanceManagementService.deleteAppraisal(appraisalId, currentUser);
            return ResponseEntity.ok().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/appraisals/statistics")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<Map<String, Object>> getAppraisalStatistics() {
        try {
            User currentUser = getCurrentUser();
            Map<String, Object> statistics = performanceManagementService.getAppraisalStatistics(currentUser);
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // ==================== AI SUGGESTIONS ====================
    
    @PostMapping("/suggestions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AISuggestionDto> createSuggestion(@RequestBody AISuggestionDto suggestionDto) {
        try {
            User currentUser = getCurrentUser();
            AISuggestionDto createdSuggestion = performanceManagementService.createSuggestion(suggestionDto, currentUser);
            return ResponseEntity.ok(createdSuggestion);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/suggestions/{suggestionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AISuggestionDto> updateSuggestion(@PathVariable Long suggestionId, @RequestBody AISuggestionDto suggestionDto) {
        try {
            User currentUser = getCurrentUser();
            AISuggestionDto updatedSuggestion = performanceManagementService.updateSuggestion(suggestionId, suggestionDto, currentUser);
            return ResponseEntity.ok(updatedSuggestion);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/suggestions/{suggestionId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<AISuggestionDto> getSuggestionById(@PathVariable Long suggestionId) {
        try {
            User currentUser = getCurrentUser();
            AISuggestionDto suggestion = performanceManagementService.getSuggestionById(suggestionId, currentUser);
            return ResponseEntity.ok(suggestion);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/suggestions/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<List<AISuggestionDto>> getSuggestionsByUser(@PathVariable Long userId) {
        try {
            User currentUser = getCurrentUser();
            List<AISuggestionDto> suggestions = performanceManagementService.getSuggestionsByUser(userId, currentUser);
            return ResponseEntity.ok(suggestions);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/suggestions/department/{department}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<AISuggestionDto>> getSuggestionsByDepartment(@PathVariable String department) {
        try {
            User currentUser = getCurrentUser();
            List<AISuggestionDto> suggestions = performanceManagementService.getSuggestionsByDepartment(department, currentUser);
            return ResponseEntity.ok(suggestions);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/suggestions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AISuggestionDto>> getAllSuggestions() {
        try {
            User currentUser = getCurrentUser();
            List<AISuggestionDto> suggestions = performanceManagementService.getAllSuggestions(currentUser);
            return ResponseEntity.ok(suggestions);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/suggestions/{suggestionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSuggestion(@PathVariable Long suggestionId) {
        try {
            User currentUser = getCurrentUser();
            performanceManagementService.deleteSuggestion(suggestionId, currentUser);
            return ResponseEntity.ok().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/suggestions/{suggestionId}/implement")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<AISuggestionDto> implementSuggestion(@PathVariable Long suggestionId, @RequestBody Map<String, String> request) {
        try {
            User currentUser = getCurrentUser();
            String notes = request.get("notes");
            AISuggestionDto implementedSuggestion = performanceManagementService.implementSuggestion(suggestionId, notes, currentUser);
            return ResponseEntity.ok(implementedSuggestion);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/suggestions/{suggestionId}/dismiss")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<AISuggestionDto> dismissSuggestion(@PathVariable Long suggestionId) {
        try {
            User currentUser = getCurrentUser();
            AISuggestionDto dismissedSuggestion = performanceManagementService.dismissSuggestion(suggestionId, currentUser);
            return ResponseEntity.ok(dismissedSuggestion);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/suggestions/statistics")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<Map<String, Object>> getSuggestionStatistics() {
        try {
            User currentUser = getCurrentUser();
            Map<String, Object> statistics = performanceManagementService.getSuggestionStatistics(currentUser);
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // ==================== REPORTS ====================
    
    @GetMapping("/reports/department/{department}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Map<String, Object>> getPerformanceReport(
            @PathVariable String department,
            @RequestParam(required = false) String period) {
        try {
            User currentUser = getCurrentUser();
            Map<String, Object> report = performanceManagementService.getPerformanceReport(department, period, currentUser);
            return ResponseEntity.ok(report);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/reports/team/{managerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Map<String, Object>> getTeamPerformanceReport(
            @PathVariable Long managerId,
            @RequestParam(required = false) String period) {
        try {
            User currentUser = getCurrentUser();
            Map<String, Object> report = performanceManagementService.getTeamPerformanceReport(managerId, period, currentUser);
            return ResponseEntity.ok(report);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/reports/company")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getCompanyWidePerformanceReport(
            @RequestParam(required = false) String period) {
        try {
            User currentUser = getCurrentUser();
            Map<String, Object> report = performanceManagementService.getCompanyWidePerformanceReport(period, currentUser);
            return ResponseEntity.ok(report);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // ==================== UTILITY ENDPOINTS ====================
    
    @GetMapping("/departments")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<String>> getAccessibleDepartments() {
        try {
            User currentUser = getCurrentUser();
            List<String> departments = performanceManagementService.getAccessibleDepartments(currentUser);
            return ResponseEntity.ok(departments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 
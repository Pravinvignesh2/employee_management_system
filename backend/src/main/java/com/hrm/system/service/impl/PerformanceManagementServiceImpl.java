package com.hrm.system.service.impl;

import com.hrm.system.dto.*;
import com.hrm.system.entity.*;
import com.hrm.system.repository.*;
import com.hrm.system.service.PerformanceManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.Arrays;

@Service
@Transactional
public class PerformanceManagementServiceImpl implements PerformanceManagementService {

    @Autowired
    private PerformanceGoalRepository performanceGoalRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private AppraisalRepository appraisalRepository;

    @Autowired
    private AISuggestionRepository aiSuggestionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FeedbackRequestRepository feedbackRequestRepository;

    // Performance Goals Implementation
    @Override
    public PerformanceGoalDto createGoal(PerformanceGoalDto goalDto, User currentUser) {
        // Check permissions
        if (!hasAccessToUser(goalDto.getUserId(), currentUser)) {
            User targetUser = userRepository.findById(goalDto.getUserId()).orElse(null);
            if (currentUser.getRole().equals(User.UserRole.MANAGER) && targetUser != null) {
                throw new SecurityException("You can only assign goals to employees in your department ("
                        + currentUser.getDepartment() + "). " + targetUser.getFirstName() + " "
                        + targetUser.getLastName() + " is in " + targetUser.getDepartment() + " department.");
            } else if (currentUser.getRole().equals(User.UserRole.EMPLOYEE)) {
                throw new SecurityException("You can only create goals for yourself");
            } else {
                throw new SecurityException("Access denied to create goal for this user");
            }
        }

        User targetUser = userRepository.findById(goalDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        PerformanceGoal goal = new PerformanceGoal();
        goal.setUser(targetUser);
        goal.setTitle(goalDto.getTitle());
        goal.setDescription(goalDto.getDescription());
        goal.setStatus(goalDto.getStatus());
        goal.setProgress(goalDto.getProgress());
        goal.setTarget(goalDto.getTarget());
        goal.setCurrent(goalDto.getCurrent());
        goal.setDueDate(goalDto.getDueDate());
        goal.setType(goalDto.getType());
        goal.setAssignedBy(currentUser);

        PerformanceGoal savedGoal = performanceGoalRepository.save(goal);
        return new PerformanceGoalDto(savedGoal);
    }

    @Override
    public PerformanceGoalDto updateGoal(Long goalId, PerformanceGoalDto goalDto, User currentUser) {
        PerformanceGoal goal = performanceGoalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        // Check permissions
        if (!hasAccessToUser(goal.getUser().getId(), currentUser)) {
            throw new SecurityException("Access denied to update this goal");
        }

        goal.setTitle(goalDto.getTitle());
        goal.setDescription(goalDto.getDescription());
        goal.setStatus(goalDto.getStatus());
        goal.setProgress(goalDto.getProgress());
        goal.setTarget(goalDto.getTarget());
        goal.setCurrent(goalDto.getCurrent());
        goal.setDueDate(goalDto.getDueDate());
        goal.setType(goalDto.getType());

        PerformanceGoal updatedGoal = performanceGoalRepository.save(goal);
        return new PerformanceGoalDto(updatedGoal);
    }

    @Override
    public PerformanceGoalDto getGoalById(Long goalId, User currentUser) {
        PerformanceGoal goal = performanceGoalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        // Check permissions
        if (!hasAccessToUser(goal.getUser().getId(), currentUser)) {
            throw new SecurityException("Access denied to view this goal");
        }

        return new PerformanceGoalDto(goal);
    }

    @Override
    public List<PerformanceGoalDto> getGoalsByUser(Long userId, User currentUser) {
        // Check permissions
        if (!hasAccessToUser(userId, currentUser)) {
            throw new SecurityException("Access denied to view goals for this user");
        }

        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<PerformanceGoal> goals = performanceGoalRepository.findByUserOrderByCreatedAtDesc(targetUser);
        return goals.stream().map(PerformanceGoalDto::new).collect(Collectors.toList());
    }

    @Override
    public List<PerformanceGoalDto> getGoalsByDepartment(String department, User currentUser) {
        // Check permissions
        if (!hasAccessToDepartment(department, currentUser)) {
            throw new SecurityException("Access denied to view goals for this department");
        }

        User.Department dept = User.Department.valueOf(department.toUpperCase());
        List<PerformanceGoal> goals = performanceGoalRepository.findByDepartment(dept);
        return goals.stream().map(PerformanceGoalDto::new).collect(Collectors.toList());
    }

    @Override
    public List<PerformanceGoalDto> getAllGoals(User currentUser) {
        // Only admin can view all goals
        if (!currentUser.getRole().equals(User.UserRole.ADMIN)) {
            throw new SecurityException("Only admin can view all goals");
        }

        List<PerformanceGoal> goals = performanceGoalRepository.findAll();
        return goals.stream().map(PerformanceGoalDto::new).collect(Collectors.toList());
    }

    @Override
    public void deleteGoal(Long goalId, User currentUser) {
        PerformanceGoal goal = performanceGoalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        // Check permissions
        if (!hasAccessToUser(goal.getUser().getId(), currentUser)) {
            throw new SecurityException("Access denied to delete this goal");
        }

        performanceGoalRepository.delete(goal);
    }

    @Override
    public Map<String, Object> getGoalStatistics(User currentUser) {
        Map<String, Object> statistics = new HashMap<>();

        if (currentUser.getRole().equals(User.UserRole.ADMIN)) {
            // Company-wide statistics
            statistics.put("totalGoals", performanceGoalRepository.count());
            statistics.put("completedGoals",
                    performanceGoalRepository.countByStatus(PerformanceGoal.GoalStatus.COMPLETED));
            statistics.put("onTrackGoals",
                    performanceGoalRepository.countByStatus(PerformanceGoal.GoalStatus.ON_TRACK));
            statistics.put("atRiskGoals", performanceGoalRepository.countByStatus(PerformanceGoal.GoalStatus.AT_RISK));
            statistics.put("overdueGoals", performanceGoalRepository.countByStatus(PerformanceGoal.GoalStatus.OVERDUE));
        } else if (currentUser.getRole().equals(User.UserRole.MANAGER)) {
            // Department statistics
            User.Department dept = currentUser.getDepartment();
            statistics.put("totalGoals", performanceGoalRepository.countByDepartmentAndStatus(dept, null));
            statistics.put("completedGoals",
                    performanceGoalRepository.countByDepartmentAndStatus(dept, PerformanceGoal.GoalStatus.COMPLETED));
            statistics.put("onTrackGoals",
                    performanceGoalRepository.countByDepartmentAndStatus(dept, PerformanceGoal.GoalStatus.ON_TRACK));
            statistics.put("atRiskGoals",
                    performanceGoalRepository.countByDepartmentAndStatus(dept, PerformanceGoal.GoalStatus.AT_RISK));
        } else {
            // Employee statistics
            statistics.put("totalGoals", performanceGoalRepository.countByUserAndStatus(currentUser, null));
            statistics.put("completedGoals",
                    performanceGoalRepository.countByUserAndStatus(currentUser, PerformanceGoal.GoalStatus.COMPLETED));
            statistics.put("onTrackGoals",
                    performanceGoalRepository.countByUserAndStatus(currentUser, PerformanceGoal.GoalStatus.ON_TRACK));
            statistics.put("atRiskGoals",
                    performanceGoalRepository.countByUserAndStatus(currentUser, PerformanceGoal.GoalStatus.AT_RISK));
        }

        return statistics;
    }

    // Feedback Implementation
    @Override
    public FeedbackDto createFeedback(FeedbackDto feedbackDto, User currentUser) {
        // Check permissions
        User recipient = userRepository.findById(feedbackDto.getRecipientId())
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        boolean allowed = hasAccessToUser(recipient.getId(), currentUser);
        if (!allowed) {
            // Allow employees to give feedback to users in their own department
            // (peers/managers)
            if (currentUser.getRole().equals(User.UserRole.EMPLOYEE)) {
                allowed = recipient.getDepartment() != null && currentUser.getDepartment() != null
                        && recipient.getDepartment().equals(currentUser.getDepartment());
            }
        }
        if (!allowed) {
            if (currentUser.getRole().equals(User.UserRole.MANAGER)) {
                throw new SecurityException("You can only give feedback to employees in your department ("
                        + currentUser.getDepartment() + "). " + recipient.getFirstName() + " " + recipient.getLastName()
                        + " is in " + recipient.getDepartment() + " department.");
            } else if (currentUser.getRole().equals(User.UserRole.EMPLOYEE)) {
                throw new SecurityException("You can only give feedback to users in your department ("
                        + currentUser.getDepartment() + ").");
            } else {
                throw new SecurityException("Access denied to create feedback for this user");
            }
        }

        Feedback feedback = new Feedback();
        feedback.setRecipient(recipient);
        feedback.setReviewer(currentUser);
        feedback.setType(feedbackDto.getType());
        feedback.setRating(feedbackDto.getRating());
        feedback.setComment(feedbackDto.getComment());
        feedback.setReviewPeriod(feedbackDto.getReviewPeriod());
        feedback.setIsAnonymous(feedbackDto.getIsAnonymous());
        feedback.setStatus(Feedback.FeedbackStatus.SUBMITTED);

        Feedback savedFeedback = feedbackRepository.save(feedback);
        return new FeedbackDto(savedFeedback);
    }

    @Override
    public FeedbackDto updateFeedback(Long feedbackId, FeedbackDto feedbackDto, User currentUser) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));

        // Check permissions - only the reviewer can update their feedback
        if (!feedback.getReviewer().getId().equals(currentUser.getId())) {
            throw new SecurityException("Access denied to update this feedback");
        }

        feedback.setRating(feedbackDto.getRating());
        feedback.setComment(feedbackDto.getComment());
        feedback.setIsAnonymous(feedbackDto.getIsAnonymous());

        Feedback updatedFeedback = feedbackRepository.save(feedback);
        return new FeedbackDto(updatedFeedback);
    }

    @Override
    public FeedbackDto getFeedbackById(Long feedbackId, User currentUser) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));

        // Check permissions
        if (!hasAccessToUser(feedback.getRecipient().getId(), currentUser) &&
                !feedback.getReviewer().getId().equals(currentUser.getId())) {
            throw new SecurityException("Access denied to view this feedback");
        }

        return new FeedbackDto(feedback);
    }

    @Override
    public List<FeedbackDto> getFeedbackByRecipient(Long recipientId, User currentUser) {
        // Check permissions
        if (!hasAccessToUser(recipientId, currentUser)) {
            throw new SecurityException("Access denied to view feedback for this user");
        }

        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        List<Feedback> feedbacks = feedbackRepository.findByRecipientOrderByCreatedAtDesc(recipient);
        return feedbacks.stream().map(FeedbackDto::new).collect(Collectors.toList());
    }

    @Override
    public List<FeedbackDto> getFeedbackByReviewer(Long reviewerId, User currentUser) {
        // Check permissions
        if (!hasAccessToUser(reviewerId, currentUser)) {
            throw new SecurityException("Access denied to view feedback for this user");
        }

        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new RuntimeException("Reviewer not found"));

        List<Feedback> feedbacks = feedbackRepository.findByReviewerOrderByCreatedAtDesc(reviewer);
        return feedbacks.stream().map(FeedbackDto::new).collect(Collectors.toList());
    }

    @Override
    public List<FeedbackDto> getFeedbackByDepartment(String department, User currentUser) {
        // Check permissions
        if (!hasAccessToDepartment(department, currentUser)) {
            throw new SecurityException("Access denied to view feedback for this department");
        }

        User.Department dept = User.Department.valueOf(department.toUpperCase());
        List<Feedback> feedbacks = feedbackRepository.findByDepartment(dept);
        return feedbacks.stream().map(FeedbackDto::new).collect(Collectors.toList());
    }

    @Override
    public List<FeedbackDto> getAllFeedback(User currentUser) {
        // Only admin can view all feedback
        if (!currentUser.getRole().equals(User.UserRole.ADMIN)) {
            throw new SecurityException("Only admin can view all feedback");
        }

        List<Feedback> feedbacks = feedbackRepository.findAll();
        return feedbacks.stream().map(FeedbackDto::new).collect(Collectors.toList());
    }

    @Override
    public void deleteFeedback(Long feedbackId, User currentUser) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));

        // Check permissions - only the reviewer or admin can delete feedback
        if (!feedback.getReviewer().getId().equals(currentUser.getId()) &&
                !currentUser.getRole().equals(User.UserRole.ADMIN)) {
            throw new SecurityException("Access denied to delete this feedback");
        }

        feedbackRepository.delete(feedback);
    }

    @Override
    public Map<String, Object> getFeedbackStatistics(User currentUser) {
        Map<String, Object> statistics = new HashMap<>();

        if (currentUser.getRole().equals(User.UserRole.ADMIN)) {
            // Company-wide statistics
            statistics.put("totalFeedback", feedbackRepository.count());
            statistics.put("peerFeedback", feedbackRepository.countByType(Feedback.FeedbackType.PEER));
            statistics.put("managerFeedback", feedbackRepository.countByType(Feedback.FeedbackType.MANAGER));
            statistics.put("selfFeedback", feedbackRepository.countByType(Feedback.FeedbackType.SELF));
        } else if (currentUser.getRole().equals(User.UserRole.MANAGER)) {
            // Department statistics
            User.Department dept = currentUser.getDepartment();
            statistics.put("totalFeedback", feedbackRepository.countByDepartmentAndType(dept, null));
            statistics.put("peerFeedback",
                    feedbackRepository.countByDepartmentAndType(dept, Feedback.FeedbackType.PEER));
            statistics.put("managerFeedback",
                    feedbackRepository.countByDepartmentAndType(dept, Feedback.FeedbackType.MANAGER));
            statistics.put("selfFeedback",
                    feedbackRepository.countByDepartmentAndType(dept, Feedback.FeedbackType.SELF));
        } else {
            // Employee statistics
            statistics.put("totalFeedback", feedbackRepository.countByRecipientAndType(currentUser, null));
            statistics.put("peerFeedback",
                    feedbackRepository.countByRecipientAndType(currentUser, Feedback.FeedbackType.PEER));
            statistics.put("managerFeedback",
                    feedbackRepository.countByRecipientAndType(currentUser, Feedback.FeedbackType.MANAGER));
            statistics.put("selfFeedback",
                    feedbackRepository.countByRecipientAndType(currentUser, Feedback.FeedbackType.SELF));
        }

        return statistics;
    }

    // Utility methods
    @Override
    public boolean hasAccessToUser(Long targetUserId, User currentUser) {
        if (currentUser.getRole().equals(User.UserRole.ADMIN)) {
            return true; // Admin has access to all users
        } else if (currentUser.getRole().equals(User.UserRole.MANAGER)) {
            // Manager can access users in their department
            User targetUser = userRepository.findById(targetUserId).orElse(null);
            return targetUser != null && targetUser.getDepartment().equals(currentUser.getDepartment());
        } else {
            // Employee can only access their own data
            return currentUser.getId().equals(targetUserId);
        }
    }

    @Override
    public boolean hasAccessToDepartment(String department, User currentUser) {
        if (currentUser.getRole().equals(User.UserRole.ADMIN)) {
            return true; // Admin has access to all departments
        } else if (currentUser.getRole().equals(User.UserRole.MANAGER)) {
            // Manager can only access their own department
            return currentUser.getDepartment().name().equalsIgnoreCase(department);
        } else {
            return false; // Employee cannot access department-level data
        }
    }

    @Override
    public List<String> getAccessibleDepartments(User currentUser) {
        if (currentUser.getRole().equals(User.UserRole.ADMIN)) {
            // Admin can access all departments
            return Arrays.stream(User.Department.values())
                    .map(Enum::name)
                    .collect(Collectors.toList());
        } else if (currentUser.getRole().equals(User.UserRole.MANAGER)) {
            // Manager can only access their own department
            return List.of(currentUser.getDepartment().name());
        } else {
            return new ArrayList<>(); // Employee cannot access department-level data
        }
    }

    // Placeholder implementations for remaining methods
    // These would be implemented similarly to the above methods

    @Override
    public AppraisalDto createAppraisal(AppraisalDto appraisalDto, User currentUser) {
        // Check permissions - only managers and admins can create appraisals
        if (!currentUser.getRole().equals(User.UserRole.ADMIN)
                && !currentUser.getRole().equals(User.UserRole.MANAGER)) {
            throw new SecurityException("Only managers and admins can create appraisals");
        }

        User employee = userRepository.findById(appraisalDto.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        User manager = userRepository.findById(appraisalDto.getManagerId())
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        Appraisal appraisal = new Appraisal();
        appraisal.setEmployee(employee);
        appraisal.setManager(manager);
        appraisal.setPeriod(appraisalDto.getPeriod());
        appraisal.setRating(appraisalDto.getRating());
        appraisal.setAchievements(appraisalDto.getAchievements());
        appraisal.setImprovements(appraisalDto.getImprovements());
        appraisal.setGoals(appraisalDto.getGoals());
        appraisal.setStatus(appraisalDto.getStatus());
        appraisal.setAppraisalDate(appraisalDto.getAppraisalDate());
        appraisal.setEmployeeComments(appraisalDto.getEmployeeComments());
        appraisal.setManagerComments(appraisalDto.getManagerComments());

        Appraisal savedAppraisal = appraisalRepository.save(appraisal);
        return new AppraisalDto(savedAppraisal);
    }

    @Override
    public AppraisalDto updateAppraisal(Long appraisalId, AppraisalDto appraisalDto, User currentUser) {
        Appraisal appraisal = appraisalRepository.findById(appraisalId)
                .orElseThrow(() -> new RuntimeException("Appraisal not found"));

        // Check permissions - only managers and admins can update appraisals
        if (!currentUser.getRole().equals(User.UserRole.ADMIN)
                && !currentUser.getRole().equals(User.UserRole.MANAGER)) {
            throw new SecurityException("Only managers and admins can update appraisals");
        }

        // Update fields
        appraisal.setPeriod(appraisalDto.getPeriod());
        appraisal.setRating(appraisalDto.getRating());
        appraisal.setAchievements(appraisalDto.getAchievements());
        appraisal.setImprovements(appraisalDto.getImprovements());
        appraisal.setGoals(appraisalDto.getGoals());
        appraisal.setStatus(appraisalDto.getStatus());
        appraisal.setAppraisalDate(appraisalDto.getAppraisalDate());
        appraisal.setEmployeeComments(appraisalDto.getEmployeeComments());
        appraisal.setManagerComments(appraisalDto.getManagerComments());

        Appraisal updatedAppraisal = appraisalRepository.save(appraisal);
        return new AppraisalDto(updatedAppraisal);
    }

    @Override
    public AppraisalDto getAppraisalById(Long appraisalId, User currentUser) {
        Appraisal appraisal = appraisalRepository.findById(appraisalId)
                .orElseThrow(() -> new RuntimeException("Appraisal not found"));

        // Check permissions
        if (!hasAccessToUser(appraisal.getEmployee().getId(), currentUser) &&
                !hasAccessToUser(appraisal.getManager().getId(), currentUser)) {
            throw new SecurityException("Access denied to view this appraisal");
        }

        return new AppraisalDto(appraisal);
    }

    @Override
    public List<AppraisalDto> getAppraisalsByEmployee(Long employeeId, User currentUser) {
        // Check permissions
        if (!hasAccessToUser(employeeId, currentUser)) {
            throw new SecurityException("Access denied to view appraisals for this employee");
        }

        User employee = userRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        List<Appraisal> appraisals;

        // Status-based access control
        if (currentUser.getRole() == User.UserRole.EMPLOYEE && currentUser.getId().equals(employeeId)) {
            // Employee can only see completed appraisals
            appraisals = appraisalRepository.findByEmployeeAndStatusOrderByAppraisalDateDesc(employee,
                    Appraisal.AppraisalStatus.COMPLETED);
        } else if (currentUser.getRole() == User.UserRole.MANAGER) {
            // Manager can see all appraisals for their department employees
            if (employee.getDepartment() == currentUser.getDepartment()) {
                appraisals = appraisalRepository.findByEmployeeOrderByAppraisalDateDesc(employee);
            } else {
                throw new SecurityException("Access denied to view appraisals for this employee");
            }
        } else if (currentUser.getRole() == User.UserRole.ADMIN) {
            // Admin can see all appraisals
            appraisals = appraisalRepository.findByEmployeeOrderByAppraisalDateDesc(employee);
        } else {
            throw new SecurityException("Access denied to view appraisals");
        }

        return appraisals.stream()
                .map(AppraisalDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<RatingTrendPointDto> getRatingTrendsByEmployee(Long employeeId, User currentUser) {
        // Check permissions
        if (!hasAccessToUser(employeeId, currentUser)) {
            throw new SecurityException("Access denied to view rating trends for this employee");
        }

        User employee = userRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        List<Appraisal> completed = appraisalRepository
                .findByEmployeeAndStatusOrderByAppraisalDateAsc(employee, Appraisal.AppraisalStatus.COMPLETED);

        return completed.stream()
                .map(a -> new RatingTrendPointDto(a.getPeriod(), a.getRating(), a.getAppraisalDate()))
                .collect(Collectors.toList());
    }

    @Override
    public List<AppraisalDto> getAppraisalsByManager(Long managerId, User currentUser) {
        // Check permissions
        if (!hasAccessToUser(managerId, currentUser)) {
            throw new SecurityException("Access denied to view appraisals for this manager");
        }

        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        List<Appraisal> appraisals = appraisalRepository.findByManagerOrderByAppraisalDateDesc(manager);
        return appraisals.stream()
                .map(AppraisalDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppraisalDto> getAppraisalsByDepartment(String department, User currentUser) {
        // Check permissions
        if (!hasAccessToDepartment(department, currentUser)) {
            throw new SecurityException("Access denied to view appraisals for this department");
        }

        try {
            User.Department dept = User.Department.valueOf(department.toUpperCase());
            List<Appraisal> appraisals;

            // Status-based access control
            if (currentUser.getRole() == User.UserRole.EMPLOYEE) {
                // Employee can only see completed appraisals from their department
                if (currentUser.getDepartment() == dept) {
                    appraisals = appraisalRepository.findByDepartmentAndStatus(dept,
                            Appraisal.AppraisalStatus.COMPLETED);
                } else {
                    throw new SecurityException("Access denied to view appraisals for this department");
                }
            } else if (currentUser.getRole() == User.UserRole.MANAGER) {
                // Manager can see all appraisals for their department
                if (currentUser.getDepartment() == dept) {
                    appraisals = appraisalRepository.findByDepartment(dept);
                } else {
                    throw new SecurityException("Access denied to view appraisals for this department");
                }
            } else if (currentUser.getRole() == User.UserRole.ADMIN) {
                // Admin can see all appraisals
                appraisals = appraisalRepository.findByDepartment(dept);
            } else {
                throw new SecurityException("Access denied to view appraisals");
            }

            return appraisals.stream()
                    .map(AppraisalDto::new)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid department: " + department);
        }
    }

    @Override
    public List<AppraisalDto> getAllAppraisals(User currentUser) {
        // Only admins can view all appraisals
        if (!currentUser.getRole().equals(User.UserRole.ADMIN)) {
            throw new SecurityException("Only admins can view all appraisals");
        }

        List<Appraisal> appraisals = appraisalRepository.findAll();
        return appraisals.stream()
                .map(AppraisalDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteAppraisal(Long appraisalId, User currentUser) {
        Appraisal appraisal = appraisalRepository.findById(appraisalId)
                .orElseThrow(() -> new RuntimeException("Appraisal not found"));

        // Only admins can delete appraisals
        if (!currentUser.getRole().equals(User.UserRole.ADMIN)) {
            throw new SecurityException("Only admins can delete appraisals");
        }

        appraisalRepository.delete(appraisal);
    }

    @Override
    public List<AppraisalDto> getEditableAppraisalsByEmployee(Long employeeId, User currentUser) {
        // Check permissions - only managers and admins can edit appraisals
        if (!currentUser.getRole().equals(User.UserRole.ADMIN)
                && !currentUser.getRole().equals(User.UserRole.MANAGER)) {
            throw new SecurityException("Only managers and admins can edit appraisals");
        }

        User employee = userRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // Check if manager has access to this employee
        if (currentUser.getRole() == User.UserRole.MANAGER && employee.getDepartment() != currentUser.getDepartment()) {
            throw new SecurityException("Access denied to edit appraisals for this employee");
        }

        // Get draft and submitted appraisals that can be edited
        List<Appraisal> editableAppraisals = appraisalRepository.findByEmployeeAndStatusInOrderByAppraisalDateDesc(
                employee,
                Arrays.asList(Appraisal.AppraisalStatus.DRAFT, Appraisal.AppraisalStatus.SUBMITTED));

        return editableAppraisals.stream()
                .map(AppraisalDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getAppraisalStatistics(User currentUser) {
        Map<String, Object> statistics = new HashMap<>();

        if (currentUser.getRole().equals(User.UserRole.ADMIN)) {
            // Admin can see all statistics - use findAll() and filter in memory for now
            List<Appraisal> allAppraisals = appraisalRepository.findAll();
            statistics.put("totalAppraisals", (long) allAppraisals.size());
            statistics.put("completedAppraisals",
                    allAppraisals.stream().filter(a -> a.getStatus() == Appraisal.AppraisalStatus.COMPLETED).count());
            statistics.put("pendingAppraisals",
                    allAppraisals.stream().filter(a -> a.getStatus() == Appraisal.AppraisalStatus.DRAFT
                            || a.getStatus() == Appraisal.AppraisalStatus.SUBMITTED).count());
            statistics.put("approvedAppraisals",
                    allAppraisals.stream().filter(a -> a.getStatus() == Appraisal.AppraisalStatus.APPROVED).count());
            statistics.put("rejectedAppraisals",
                    allAppraisals.stream().filter(a -> a.getStatus() == Appraisal.AppraisalStatus.REJECTED).count());
        } else if (currentUser.getRole().equals(User.UserRole.MANAGER)) {
            // Manager can see statistics for their team
            List<Appraisal> managerAppraisals = appraisalRepository.findByManagerOrderByAppraisalDateDesc(currentUser);
            statistics.put("totalAppraisals", (long) managerAppraisals.size());
            statistics.put("completedAppraisals", managerAppraisals.stream()
                    .filter(a -> a.getStatus() == Appraisal.AppraisalStatus.COMPLETED).count());
            statistics.put("pendingAppraisals",
                    managerAppraisals.stream().filter(a -> a.getStatus() == Appraisal.AppraisalStatus.DRAFT
                            || a.getStatus() == Appraisal.AppraisalStatus.SUBMITTED).count());
            statistics.put("approvedAppraisals", managerAppraisals.stream()
                    .filter(a -> a.getStatus() == Appraisal.AppraisalStatus.APPROVED).count());
            statistics.put("rejectedAppraisals", managerAppraisals.stream()
                    .filter(a -> a.getStatus() == Appraisal.AppraisalStatus.REJECTED).count());
        } else {
            // Employee can see their own statistics
            List<Appraisal> employeeAppraisals = appraisalRepository
                    .findByEmployeeOrderByAppraisalDateDesc(currentUser);
            statistics.put("totalAppraisals", (long) employeeAppraisals.size());
            statistics.put("completedAppraisals", employeeAppraisals.stream()
                    .filter(a -> a.getStatus() == Appraisal.AppraisalStatus.COMPLETED).count());
            statistics.put("pendingAppraisals",
                    employeeAppraisals.stream().filter(a -> a.getStatus() == Appraisal.AppraisalStatus.DRAFT
                            || a.getStatus() == Appraisal.AppraisalStatus.SUBMITTED).count());
            statistics.put("approvedAppraisals", employeeAppraisals.stream()
                    .filter(a -> a.getStatus() == Appraisal.AppraisalStatus.APPROVED).count());
            statistics.put("rejectedAppraisals", employeeAppraisals.stream()
                    .filter(a -> a.getStatus() == Appraisal.AppraisalStatus.REJECTED).count());
        }

        return statistics;
    }

    @Override
    public AISuggestionDto createSuggestion(AISuggestionDto suggestionDto, User currentUser) {
        // Only admins can create AI suggestions
        if (!currentUser.getRole().equals(User.UserRole.ADMIN)) {
            throw new SecurityException("Only admins can create AI suggestions");
        }

        User targetUser = userRepository.findById(suggestionDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        AISuggestion suggestion = new AISuggestion();
        suggestion.setUser(targetUser);
        suggestion.setTitle(suggestionDto.getTitle());
        suggestion.setDescription(suggestionDto.getDescription());
        suggestion.setCategory(suggestionDto.getCategory());
        suggestion.setPriority(suggestionDto.getPriority());
        suggestion.setType(suggestionDto.getType());
        suggestion.setStatus(suggestionDto.getStatus());
        suggestion.setAiScore(suggestionDto.getAiScore());
        suggestion.setImplementationNotes(suggestionDto.getImplementationNotes());

        AISuggestion savedSuggestion = aiSuggestionRepository.save(suggestion);
        return new AISuggestionDto(savedSuggestion);
    }

    @Override
    public AISuggestionDto updateSuggestion(Long suggestionId, AISuggestionDto suggestionDto, User currentUser) {
        AISuggestion suggestion = aiSuggestionRepository.findById(suggestionId)
                .orElseThrow(() -> new RuntimeException("Suggestion not found"));

        // Only admins can update AI suggestions
        if (!currentUser.getRole().equals(User.UserRole.ADMIN)) {
            throw new SecurityException("Only admins can update AI suggestions");
        }

        suggestion.setTitle(suggestionDto.getTitle());
        suggestion.setDescription(suggestionDto.getDescription());
        suggestion.setCategory(suggestionDto.getCategory());
        suggestion.setPriority(suggestionDto.getPriority());
        suggestion.setType(suggestionDto.getType());
        suggestion.setStatus(suggestionDto.getStatus());
        suggestion.setAiScore(suggestionDto.getAiScore());
        suggestion.setImplementationNotes(suggestionDto.getImplementationNotes());

        AISuggestion updatedSuggestion = aiSuggestionRepository.save(suggestion);
        return new AISuggestionDto(updatedSuggestion);
    }

    @Override
    public AISuggestionDto getSuggestionById(Long suggestionId, User currentUser) {
        AISuggestion suggestion = aiSuggestionRepository.findById(suggestionId)
                .orElseThrow(() -> new RuntimeException("Suggestion not found"));

        // Check permissions
        if (!hasAccessToUser(suggestion.getUser().getId(), currentUser)) {
            throw new SecurityException("Access denied to view this suggestion");
        }

        return new AISuggestionDto(suggestion);
    }

    @Override
    public List<AISuggestionDto> getSuggestionsByUser(Long userId, User currentUser) {
        // Check permissions
        if (!hasAccessToUser(userId, currentUser)) {
            throw new SecurityException("Access denied to view suggestions for this user");
        }

        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<AISuggestion> suggestions = aiSuggestionRepository.findByUserOrderByCreatedAtDesc(targetUser);
        return suggestions.stream()
                .map(AISuggestionDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<AISuggestionDto> getSuggestionsByDepartment(String department, User currentUser) {
        // Check permissions
        if (!hasAccessToDepartment(department, currentUser)) {
            throw new SecurityException("Access denied to view suggestions for this department");
        }

        try {
            User.Department dept = User.Department.valueOf(department.toUpperCase());
            List<AISuggestion> suggestions = aiSuggestionRepository.findByDepartment(dept);
            return suggestions.stream()
                    .map(AISuggestionDto::new)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid department: " + department);
        }
    }

    @Override
    public List<AISuggestionDto> getAllSuggestions(User currentUser) {
        // Only admins can view all suggestions
        if (!currentUser.getRole().equals(User.UserRole.ADMIN)) {
            throw new SecurityException("Only admins can view all suggestions");
        }

        List<AISuggestion> suggestions = aiSuggestionRepository.findAll();
        return suggestions.stream()
                .map(AISuggestionDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteSuggestion(Long suggestionId, User currentUser) {
        AISuggestion suggestion = aiSuggestionRepository.findById(suggestionId)
                .orElseThrow(() -> new RuntimeException("Suggestion not found"));

        // Only admins can delete suggestions
        if (!currentUser.getRole().equals(User.UserRole.ADMIN)) {
            throw new SecurityException("Only admins can delete suggestions");
        }

        aiSuggestionRepository.delete(suggestion);
    }

    @Override
    public AISuggestionDto implementSuggestion(Long suggestionId, String notes, User currentUser) {
        AISuggestion suggestion = aiSuggestionRepository.findById(suggestionId)
                .orElseThrow(() -> new RuntimeException("Suggestion not found"));

        // Check permissions
        if (!hasAccessToUser(suggestion.getUser().getId(), currentUser)) {
            throw new SecurityException("Access denied to implement this suggestion");
        }

        suggestion.setStatus(AISuggestion.SuggestionStatus.IMPLEMENTED);
        suggestion.setImplementedAt(LocalDateTime.now());
        suggestion.setImplementationNotes(notes);

        AISuggestion implementedSuggestion = aiSuggestionRepository.save(suggestion);
        return new AISuggestionDto(implementedSuggestion);
    }

    @Override
    public AISuggestionDto dismissSuggestion(Long suggestionId, User currentUser) {
        AISuggestion suggestion = aiSuggestionRepository.findById(suggestionId)
                .orElseThrow(() -> new RuntimeException("Suggestion not found"));

        // Check permissions
        if (!hasAccessToUser(suggestion.getUser().getId(), currentUser)) {
            throw new SecurityException("Access denied to dismiss this suggestion");
        }

        suggestion.setStatus(AISuggestion.SuggestionStatus.DISMISSED);
        suggestion.setDismissedAt(LocalDateTime.now());

        AISuggestion dismissedSuggestion = aiSuggestionRepository.save(suggestion);
        return new AISuggestionDto(dismissedSuggestion);
    }

    @Override
    public Map<String, Object> getSuggestionStatistics(User currentUser) {
        Map<String, Object> statistics = new HashMap<>();

        if (currentUser.getRole().equals(User.UserRole.ADMIN)) {
            // Admin can see all statistics - use findAll() and filter in memory for now
            List<AISuggestion> allSuggestions = aiSuggestionRepository.findAll();
            statistics.put("totalSuggestions", (long) allSuggestions.size());
            statistics.put("activeSuggestions",
                    allSuggestions.stream().filter(s -> s.getStatus() == AISuggestion.SuggestionStatus.ACTIVE).count());
            statistics.put("implementedSuggestions", allSuggestions.stream()
                    .filter(s -> s.getStatus() == AISuggestion.SuggestionStatus.IMPLEMENTED).count());
            statistics.put("dismissedSuggestions", allSuggestions.stream()
                    .filter(s -> s.getStatus() == AISuggestion.SuggestionStatus.DISMISSED).count());
            statistics.put("highPrioritySuggestions", allSuggestions.stream()
                    .filter(s -> s.getPriority() == AISuggestion.SuggestionPriority.HIGH).count());
        } else if (currentUser.getRole().equals(User.UserRole.MANAGER)) {
            // Manager can see statistics for their department
            try {
                User.Department dept = currentUser.getDepartment();
                List<AISuggestion> deptSuggestions = aiSuggestionRepository.findByDepartment(dept);
                statistics.put("totalSuggestions", (long) deptSuggestions.size());
                statistics.put("activeSuggestions", deptSuggestions.stream()
                        .filter(s -> s.getStatus() == AISuggestion.SuggestionStatus.ACTIVE).count());
                statistics.put("implementedSuggestions", deptSuggestions.stream()
                        .filter(s -> s.getStatus() == AISuggestion.SuggestionStatus.IMPLEMENTED).count());
                statistics.put("dismissedSuggestions", deptSuggestions.stream()
                        .filter(s -> s.getStatus() == AISuggestion.SuggestionStatus.DISMISSED).count());
                statistics.put("highPrioritySuggestions", deptSuggestions.stream()
                        .filter(s -> s.getPriority() == AISuggestion.SuggestionPriority.HIGH).count());
            } catch (Exception e) {
                // If department is null, return empty statistics
                statistics.put("totalSuggestions", 0L);
                statistics.put("activeSuggestions", 0L);
                statistics.put("implementedSuggestions", 0L);
                statistics.put("dismissedSuggestions", 0L);
                statistics.put("highPrioritySuggestions", 0L);
            }
        } else {
            // Employee can see their own statistics
            List<AISuggestion> userSuggestions = aiSuggestionRepository.findByUserOrderByCreatedAtDesc(currentUser);
            statistics.put("totalSuggestions", (long) userSuggestions.size());
            statistics.put("activeSuggestions", userSuggestions.stream()
                    .filter(s -> s.getStatus() == AISuggestion.SuggestionStatus.ACTIVE).count());
            statistics.put("implementedSuggestions", userSuggestions.stream()
                    .filter(s -> s.getStatus() == AISuggestion.SuggestionStatus.IMPLEMENTED).count());
            statistics.put("dismissedSuggestions", userSuggestions.stream()
                    .filter(s -> s.getStatus() == AISuggestion.SuggestionStatus.DISMISSED).count());
            statistics.put("highPrioritySuggestions", userSuggestions.stream()
                    .filter(s -> s.getPriority() == AISuggestion.SuggestionPriority.HIGH).count());
        }

        return statistics;
    }

    @Override
    public Map<String, Object> getPerformanceReport(String department, String period, User currentUser) {
        // Check permissions
        if (!hasAccessToDepartment(department, currentUser)) {
            throw new SecurityException("Access denied to view performance report for this department");
        }

        Map<String, Object> report = new HashMap<>();
        try {
            User.Department dept = User.Department.valueOf(department.toUpperCase());

            // Get appraisals for the department
            List<Appraisal> appraisals = appraisalRepository.findByDepartment(dept);
            if (period != null && !period.isEmpty()) {
                appraisals = appraisals.stream()
                        .filter(a -> a.getPeriod().equals(period))
                        .collect(Collectors.toList());
            }

            // Calculate statistics
            report.put("totalAppraisals", (long) appraisals.size());
            report.put("averageRating", appraisals.stream()
                    .mapToDouble(Appraisal::getRating)
                    .average()
                    .orElse(0.0));
            report.put("completedAppraisals", appraisals.stream()
                    .filter(a -> a.getStatus() == Appraisal.AppraisalStatus.COMPLETED)
                    .count());
            report.put("pendingAppraisals", appraisals.stream()
                    .filter(a -> a.getStatus() == Appraisal.AppraisalStatus.DRAFT
                            || a.getStatus() == Appraisal.AppraisalStatus.SUBMITTED)
                    .count());

            // Get goals for the department
            List<PerformanceGoal> goals = performanceGoalRepository.findByDepartment(dept);
            report.put("totalGoals", (long) goals.size());
            report.put("completedGoals", goals.stream()
                    .filter(g -> g.getStatus() == PerformanceGoal.GoalStatus.COMPLETED)
                    .count());

        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid department: " + department);
        }

        return report;
    }

    @Override
    public Map<String, Object> getTeamPerformanceReport(Long managerId, String period, User currentUser) {
        // Check permissions
        if (!hasAccessToUser(managerId, currentUser)) {
            throw new SecurityException("Access denied to view team performance report for this manager");
        }

        Map<String, Object> report = new HashMap<>();

        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        // Get appraisals for the manager
        List<Appraisal> appraisals = appraisalRepository.findByManagerOrderByAppraisalDateDesc(manager);
        if (period != null && !period.isEmpty()) {
            appraisals = appraisals.stream()
                    .filter(a -> a.getPeriod().equals(period))
                    .collect(Collectors.toList());
        }

        // Calculate statistics
        report.put("totalAppraisals", (long) appraisals.size());
        report.put("averageRating", appraisals.stream()
                .mapToDouble(Appraisal::getRating)
                .average()
                .orElse(0.0));
        report.put("completedAppraisals", appraisals.stream()
                .filter(a -> a.getStatus() == Appraisal.AppraisalStatus.COMPLETED)
                .count());
        report.put("pendingAppraisals", appraisals.stream()
                .filter(a -> a.getStatus() == Appraisal.AppraisalStatus.DRAFT
                        || a.getStatus() == Appraisal.AppraisalStatus.SUBMITTED)
                .count());

        return report;
    }

    @Override
    public Map<String, Object> getCompanyWidePerformanceReport(String period, User currentUser) {
        // Only admins can view company-wide reports
        if (!currentUser.getRole().equals(User.UserRole.ADMIN)) {
            throw new SecurityException("Only admins can view company-wide performance reports");
        }

        Map<String, Object> report = new HashMap<>();

        // Get all appraisals
        List<Appraisal> appraisals = appraisalRepository.findAll();
        if (period != null && !period.isEmpty()) {
            appraisals = appraisals.stream()
                    .filter(a -> a.getPeriod().equals(period))
                    .collect(Collectors.toList());
        }

        // Calculate statistics
        report.put("totalAppraisals", (long) appraisals.size());
        report.put("averageRating", appraisals.stream()
                .mapToDouble(Appraisal::getRating)
                .average()
                .orElse(0.0));
        report.put("completedAppraisals", appraisals.stream()
                .filter(a -> a.getStatus() == Appraisal.AppraisalStatus.COMPLETED)
                .count());
        report.put("pendingAppraisals", appraisals.stream()
                .filter(a -> a.getStatus() == Appraisal.AppraisalStatus.DRAFT
                        || a.getStatus() == Appraisal.AppraisalStatus.SUBMITTED)
                .count());

        // Get all goals
        List<PerformanceGoal> goals = performanceGoalRepository.findAll();
        report.put("totalGoals", (long) goals.size());
        report.put("completedGoals", goals.stream()
                .filter(g -> g.getStatus() == PerformanceGoal.GoalStatus.COMPLETED)
                .count());

        return report;
    }

    // ==================== FEEDBACK REQUESTS IMPLEMENTATION ====================

    @Override
    public FeedbackRequestDto createFeedbackRequest(FeedbackRequestDto requestDto, User currentUser) {
        // Access rules for requesting feedback:
        // - ADMIN: can request from anyone
        // - MANAGER: can request from users in their department (including themselves)
        // - EMPLOYEE: can request from users in their department (peers/managers)
        User recipient = userRepository.findById(requestDto.getRecipientId())
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        boolean isAllowed;
        if (currentUser.getRole().equals(User.UserRole.ADMIN)) {
            isAllowed = true;
        } else if (currentUser.getRole().equals(User.UserRole.MANAGER)) {
            isAllowed = recipient.getDepartment() != null && currentUser.getDepartment() != null
                    && recipient.getDepartment().equals(currentUser.getDepartment());
        } else {
            // EMPLOYEE: same department only
            isAllowed = recipient.getDepartment() != null && currentUser.getDepartment() != null
                    && recipient.getDepartment().equals(currentUser.getDepartment());
        }

        if (!isAllowed) {
            throw new SecurityException("You can only request feedback from users in your department ("
                    + currentUser.getDepartment() + ")");
        }

        // If frontend did not send type, try to infer minimal valid value
        if (requestDto.getFeedbackType() == null) {
            throw new RuntimeException("Feedback type is required");
        }

        FeedbackRequest request = new FeedbackRequest(currentUser, recipient, requestDto.getFeedbackType(),
                requestDto.getReviewPeriod());
        request.setMessage(requestDto.getMessage());
        // Default review period if not set
        if (request.getReviewPeriod() == null || request.getReviewPeriod().isBlank()) {
            request.setReviewPeriod("Q4 2024");
        }

        FeedbackRequest savedRequest = feedbackRequestRepository.save(request);
        return new FeedbackRequestDto(savedRequest);
    }

    @Override
    public FeedbackRequestDto updateFeedbackRequestStatus(Long requestId, String status, User currentUser) {
        FeedbackRequest request = feedbackRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Feedback request not found"));

        // Check permissions
        // Recipient can always update. Requester can mark as COMPLETED after giving
        // feedback.
        boolean isRecipient = request.getRecipient().getId().equals(currentUser.getId());
        boolean isRequester = request.getRequester().getId().equals(currentUser.getId());
        if (!isRecipient && !(isRequester && "COMPLETED".equalsIgnoreCase(status))) {
            throw new SecurityException("Access denied to update this feedback request");
        }

        try {
            FeedbackRequest.FeedbackRequestStatus newStatus = FeedbackRequest.FeedbackRequestStatus
                    .valueOf(status.toUpperCase());
            request.setStatus(newStatus);

            FeedbackRequest updatedRequest = feedbackRequestRepository.save(request);
            return new FeedbackRequestDto(updatedRequest);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }
    }

    @Override
    public List<FeedbackRequestDto> getFeedbackRequestsForUser(User currentUser) {
        // Get all feedback requests where the current user is the recipient
        List<FeedbackRequest> requests = feedbackRequestRepository.findByRecipientOrderByCreatedAtDesc(currentUser);
        return requests.stream().map(FeedbackRequestDto::new).collect(Collectors.toList());
    }

    @Override
    public List<FeedbackRequestDto> getFeedbackRequestsFromUser(User currentUser) {
        // Get all feedback requests where the current user is the requester
        List<FeedbackRequest> requests = feedbackRequestRepository.findByRequesterOrderByCreatedAtDesc(currentUser);
        return requests.stream().map(FeedbackRequestDto::new).collect(Collectors.toList());
    }

    @Override
    public List<FeedbackRequestDto> getPendingFeedbackRequests(User currentUser) {
        // Get pending feedback requests for the current user
        List<FeedbackRequest> requests = feedbackRequestRepository.findPendingRequestsForRecipient(currentUser);
        return requests.stream().map(FeedbackRequestDto::new).collect(Collectors.toList());
    }
}
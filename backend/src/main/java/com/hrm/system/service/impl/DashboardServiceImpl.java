package com.hrm.system.service.impl;

import com.hrm.system.dto.DashboardActivityDto;
import com.hrm.system.entity.User;
import com.hrm.system.entity.Leave;
import com.hrm.system.entity.Performance;
import com.hrm.system.repository.UserRepository;
import com.hrm.system.repository.LeaveRepository;
import com.hrm.system.repository.PerformanceRepository;
import com.hrm.system.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LeaveRepository leaveRepository;

    @Autowired
    private PerformanceRepository performanceRepository;

    @Override
    public List<DashboardActivityDto> getRecentActivities(int limit) {
        List<DashboardActivityDto> activities = new ArrayList<>();

        // Get recent users (new employees)
        Pageable userPageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        List<User> recentUsers = userRepository.findAll(userPageable).getContent();
        
        for (User user : recentUsers) {
            activities.add(new DashboardActivityDto(
                "user-" + user.getId(),
                "USER_CREATED",
                "New Employee Added",
                user.getFirstName() + " " + user.getLastName() + " joined the company",
                user.getCreatedAt(),
                user.getId(),
                user.getFirstName() + " " + user.getLastName(),
                null,
                "person_add"
            ));
        }

        // Get recent leave activities
        Pageable leavePageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "updatedAt"));
        List<Leave> recentLeaves = leaveRepository.findAll(leavePageable).getContent();
        
        for (Leave leave : recentLeaves) {
            if (leave.getStatus().name().equals("APPROVED")) {
                activities.add(new DashboardActivityDto(
                    "leave-" + leave.getId(),
                    "LEAVE_APPROVED",
                    "Leave Request Approved",
                    "Leave request approved for " + leave.getUser().getFirstName() + " " + leave.getUser().getLastName(),
                    leave.getUpdatedAt(),
                    leave.getUser().getId(),
                    leave.getUser().getFirstName() + " " + leave.getUser().getLastName(),
                    leave.getId(),
                    "check_circle"
                ));
            } else if (leave.getStatus().name().equals("REJECTED")) {
                activities.add(new DashboardActivityDto(
                    "leave-" + leave.getId(),
                    "LEAVE_REJECTED",
                    "Leave Request Rejected",
                    "Leave request rejected for " + leave.getUser().getFirstName() + " " + leave.getUser().getLastName(),
                    leave.getUpdatedAt(),
                    leave.getUser().getId(),
                    leave.getUser().getFirstName() + " " + leave.getUser().getLastName(),
                    leave.getId(),
                    "cancel"
                ));
            }
        }

        // Get recent performance reviews
        Pageable performancePageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "updatedAt"));
        List<Performance> recentPerformance = performanceRepository.findAll(performancePageable).getContent();
        
        for (Performance performance : recentPerformance) {
            if (performance.getStatus().name().equals("COMPLETED") || 
                performance.getStatus().name().equals("APPROVED")) {
                activities.add(new DashboardActivityDto(
                    "performance-" + performance.getId(),
                    "PERFORMANCE_REVIEW",
                    "Performance Review Completed",
                    "Performance review completed for " + performance.getUser().getFirstName() + " " + performance.getUser().getLastName(),
                    performance.getUpdatedAt(),
                    performance.getUser().getId(),
                    performance.getUser().getFirstName() + " " + performance.getUser().getLastName(),
                    performance.getId(),
                    "assessment"
                ));
            }
        }

        // Sort by timestamp (most recent first) and limit
        return activities.stream()
            .sorted(Comparator.comparing(DashboardActivityDto::getTimestamp).reversed())
            .limit(limit)
            .collect(Collectors.toList());
    }

    @Override
    public List<DashboardActivityDto> getUserActivities(Long userId, int limit) {
        List<DashboardActivityDto> activities = new ArrayList<>();

        // Get user's leaves
        List<Leave> userLeaves = leaveRepository.findByUserIdOrderByStartDateDesc(userId);
        for (Leave leave : userLeaves) {
            if (leave.getStatus().name().equals("APPROVED")) {
                activities.add(new DashboardActivityDto(
                    "leave-" + leave.getId(),
                    "LEAVE_APPROVED",
                    "Leave Request Approved",
                    "Your leave request was approved",
                    leave.getUpdatedAt(),
                    userId,
                    leave.getUser().getFirstName() + " " + leave.getUser().getLastName(),
                    leave.getId(),
                    "check_circle"
                ));
            } else if (leave.getStatus().name().equals("REJECTED")) {
                activities.add(new DashboardActivityDto(
                    "leave-" + leave.getId(),
                    "LEAVE_REJECTED",
                    "Leave Request Rejected",
                    "Your leave request was rejected",
                    leave.getUpdatedAt(),
                    userId,
                    leave.getUser().getFirstName() + " " + leave.getUser().getLastName(),
                    leave.getId(),
                    "cancel"
                ));
            }
        }

        // Get user's performance reviews
        List<Performance> userPerformance = performanceRepository.findByUserIdOrderByReviewPeriodDesc(userId);
        for (Performance performance : userPerformance) {
            if (performance.getStatus().name().equals("COMPLETED") || 
                performance.getStatus().name().equals("APPROVED")) {
                activities.add(new DashboardActivityDto(
                    "performance-" + performance.getId(),
                    "PERFORMANCE_REVIEW",
                    "Performance Review Completed",
                    "Your performance review was completed",
                    performance.getUpdatedAt(),
                    userId,
                    performance.getUser().getFirstName() + " " + performance.getUser().getLastName(),
                    performance.getId(),
                    "assessment"
                ));
            }
        }

        // Sort by timestamp and limit
        return activities.stream()
            .sorted(Comparator.comparing(DashboardActivityDto::getTimestamp).reversed())
            .limit(limit)
            .collect(Collectors.toList());
    }

    @Override
    public List<DashboardActivityDto> getDepartmentActivities(String department, int limit) {
        List<DashboardActivityDto> activities = new ArrayList<>();

        // Get users from the department
        List<User> departmentUsers = userRepository.findByDepartment(User.Department.valueOf(department));
        Set<Long> departmentUserIds = departmentUsers.stream()
            .map(User::getId)
            .collect(Collectors.toSet());

        // Get leaves for department users
        List<Leave> departmentLeaves = leaveRepository.findAll().stream()
            .filter(leave -> departmentUserIds.contains(leave.getUser().getId()))
            .collect(Collectors.toList());
        for (Leave leave : departmentLeaves) {
            if (leave.getStatus().name().equals("APPROVED")) {
                activities.add(new DashboardActivityDto(
                    "leave-" + leave.getId(),
                    "LEAVE_APPROVED",
                    "Leave Request Approved",
                    "Leave request approved for " + leave.getUser().getFirstName() + " " + leave.getUser().getLastName(),
                    leave.getUpdatedAt(),
                    leave.getUser().getId(),
                    leave.getUser().getFirstName() + " " + leave.getUser().getLastName(),
                    leave.getId(),
                    "check_circle"
                ));
            }
        }

        // Get performance reviews for department users
        List<Performance> departmentPerformance = performanceRepository.findAll().stream()
            .filter(performance -> departmentUserIds.contains(performance.getUser().getId()))
            .collect(Collectors.toList());
        for (Performance performance : departmentPerformance) {
            if (performance.getStatus().name().equals("COMPLETED") || 
                performance.getStatus().name().equals("APPROVED")) {
                activities.add(new DashboardActivityDto(
                    "performance-" + performance.getId(),
                    "PERFORMANCE_REVIEW",
                    "Performance Review Completed",
                    "Performance review completed for " + performance.getUser().getFirstName() + " " + performance.getUser().getLastName(),
                    performance.getUpdatedAt(),
                    performance.getUser().getId(),
                    performance.getUser().getFirstName() + " " + performance.getUser().getLastName(),
                    performance.getId(),
                    "assessment"
                ));
            }
        }

        // Sort by timestamp and limit
        return activities.stream()
            .sorted(Comparator.comparing(DashboardActivityDto::getTimestamp).reversed())
            .limit(limit)
            .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getDashboardStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        // User statistics
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByStatus(User.UserStatus.ACTIVE);
        
        // Leave statistics
        long totalLeaves = leaveRepository.count();
        long approvedLeaves = leaveRepository.countByStatus(Leave.LeaveStatus.APPROVED);
        long pendingLeaves = leaveRepository.countByStatus(Leave.LeaveStatus.PENDING);
        
        // Performance statistics
        long totalPerformance = performanceRepository.count();
        long completedPerformance = performanceRepository.countByStatus(Performance.PerformanceStatus.COMPLETED);
        
        statistics.put("totalUsers", totalUsers);
        statistics.put("activeUsers", activeUsers);
        statistics.put("totalLeaves", totalLeaves);
        statistics.put("approvedLeaves", approvedLeaves);
        statistics.put("pendingLeaves", pendingLeaves);
        statistics.put("totalPerformance", totalPerformance);
        statistics.put("completedPerformance", completedPerformance);
        
        return statistics;
    }
} 
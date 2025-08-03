package com.hrm.system.service;

import com.hrm.system.dto.UserDto;
import com.hrm.system.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface UserService {
    
    /**
     * Create a new user
     */
    UserDto createUser(UserDto userDto);
    
    /**
     * Update an existing user
     */
    UserDto updateUser(Long id, UserDto userDto);
    
    /**
     * Get user by ID
     */
    Optional<UserDto> getUserById(Long id);
    
    /**
     * Get user by email
     */
    Optional<UserDto> getUserByEmail(String email);
    
    /**
     * Get user by employee ID
     */
    Optional<UserDto> getUserByEmployeeId(String employeeId);
    
    /**
     * Get all users with pagination
     */
    Page<UserDto> getAllUsers(Pageable pageable);
    
    /**
     * Get users by department
     */
    List<UserDto> getUsersByDepartment(User.Department department);
    
    /**
     * Get users by role
     */
    List<UserDto> getUsersByRole(User.UserRole role);
    
    /**
     * Get users by status
     */
    List<UserDto> getUsersByStatus(User.UserStatus status);
    
    /**
     * Get team members for a manager
     */
    List<UserDto> getTeamMembers(Long managerId);
    
    /**
     * Search users by name or email
     */
    List<UserDto> searchUsers(String query);
    
    /**
     * Delete user by ID
     */
    void deleteUser(Long id);
    
    /**
     * Update user status
     */
    UserDto updateUserStatus(Long id, User.UserStatus status);
    
    /**
     * Update user profile image
     */
    UserDto updateProfileImage(Long id, String imageUrl);
    
    /**
     * Get user statistics for dashboard
     */
    UserStatistics getUserStatistics();
    
    /**
     * Check if user exists by email
     */
    boolean existsByEmail(String email);
    
    /**
     * Check if user exists by employee ID
     */
    boolean existsByEmployeeId(String employeeId);
    
    /**
     * Update last login time
     */
    void updateLastLogin(Long userId);
    
    /**
     * Get active users count
     */
    long getActiveUsersCount();
    
    /**
     * Get users count by department
     */
    long getUsersCountByDepartment(User.Department department);
    
    /**
     * Get users count by role
     */
    long getUsersCountByRole(User.UserRole role);
    
    /**
     * User statistics for dashboard
     */
    class UserStatistics {
        private long totalUsers;
        private long activeUsers;
        private long newHiresThisMonth;
        private long pendingApprovals;
        
        public UserStatistics(long totalUsers, long activeUsers, long newHiresThisMonth, long pendingApprovals) {
            this.totalUsers = totalUsers;
            this.activeUsers = activeUsers;
            this.newHiresThisMonth = newHiresThisMonth;
            this.pendingApprovals = pendingApprovals;
        }
        
        // Getters
        public long getTotalUsers() { return totalUsers; }
        public long getActiveUsers() { return activeUsers; }
        public long getNewHiresThisMonth() { return newHiresThisMonth; }
        public long getPendingApprovals() { return pendingApprovals; }
    }
} 
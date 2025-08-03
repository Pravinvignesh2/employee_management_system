package com.hrm.system.repository;

import com.hrm.system.entity.PerformanceGoal;
import com.hrm.system.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PerformanceGoalRepository extends JpaRepository<PerformanceGoal, Long> {
    
    // Find goals by user
    List<PerformanceGoal> findByUserOrderByCreatedAtDesc(User user);
    
    // Find goals by user with pagination
    Page<PerformanceGoal> findByUser(User user, Pageable pageable);
    
    // Find goals by status
    List<PerformanceGoal> findByStatus(PerformanceGoal.GoalStatus status);
    
    // Find goals by user and status
    List<PerformanceGoal> findByUserAndStatus(User user, PerformanceGoal.GoalStatus status);
    
    // Find goals assigned by specific user (for managers/admins)
    List<PerformanceGoal> findByAssignedByOrderByCreatedAtDesc(User assignedBy);
    
    // Find goals by type
    List<PerformanceGoal> findByType(PerformanceGoal.GoalType type);
    
    // Find goals by user and type
    List<PerformanceGoal> findByUserAndType(User user, PerformanceGoal.GoalType type);
    
    // Find overdue goals
    @Query("SELECT pg FROM PerformanceGoal pg WHERE pg.dueDate < CURRENT_TIMESTAMP AND pg.status != 'COMPLETED'")
    List<PerformanceGoal> findOverdueGoals();
    
    // Find goals due within next 30 days
    @Query("SELECT pg FROM PerformanceGoal pg WHERE pg.dueDate >= CURRENT_TIMESTAMP AND pg.status != 'COMPLETED'")
    List<PerformanceGoal> findUpcomingGoals();
    
    // Find goals by department (for managers)
    @Query("SELECT pg FROM PerformanceGoal pg WHERE pg.user.department = :department")
    List<PerformanceGoal> findByDepartment(@Param("department") User.Department department);
    
    // Find goals by department and status
    @Query("SELECT pg FROM PerformanceGoal pg WHERE pg.user.department = :department AND pg.status = :status")
    List<PerformanceGoal> findByDepartmentAndStatus(@Param("department") User.Department department, @Param("status") PerformanceGoal.GoalStatus status);
    
    // Count goals by status for a user
    long countByUserAndStatus(User user, PerformanceGoal.GoalStatus status);
    
    // Count goals by status for a department
    @Query("SELECT COUNT(pg) FROM PerformanceGoal pg WHERE pg.user.department = :department AND pg.status = :status")
    long countByDepartmentAndStatus(@Param("department") User.Department department, @Param("status") PerformanceGoal.GoalStatus status);
    
    // Count goals by status (for admin)
    long countByStatus(PerformanceGoal.GoalStatus status);
    
    // Find goals with progress below threshold
    @Query("SELECT pg FROM PerformanceGoal pg WHERE pg.progress < :threshold AND pg.status != 'COMPLETED'")
    List<PerformanceGoal> findGoalsWithLowProgress(@Param("threshold") Integer threshold);
    
    // Find goals by user with progress below threshold
    @Query("SELECT pg FROM PerformanceGoal pg WHERE pg.user = :user AND pg.progress < :threshold AND pg.status != 'COMPLETED'")
    List<PerformanceGoal> findUserGoalsWithLowProgress(@Param("user") User user, @Param("threshold") Integer threshold);
} 
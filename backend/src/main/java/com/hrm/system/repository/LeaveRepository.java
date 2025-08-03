package com.hrm.system.repository;

import com.hrm.system.entity.Leave;
import com.hrm.system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Leave entity
 */
@Repository
public interface LeaveRepository extends JpaRepository<Leave, Long> {
    
    /**
     * Find leaves by user
     */
    List<Leave> findByUserOrderByStartDateDesc(User user);
    
    /**
     * Find leaves by user ID
     */
    @Query("SELECT l FROM Leave l WHERE l.user.id = :userId ORDER BY l.startDate DESC")
    List<Leave> findByUserIdOrderByStartDateDesc(@Param("userId") Long userId);
    
    /**
     * Find leaves by status
     */
    List<Leave> findByStatusOrderByStartDateDesc(Leave.LeaveStatus status);
    
    /**
     * Find leaves by user and status
     */
    List<Leave> findByUserAndStatusOrderByStartDateDesc(User user, Leave.LeaveStatus status);
    
    /**
     * Find leaves by user ID and status
     */
    @Query("SELECT l FROM Leave l WHERE l.user.id = :userId AND l.status = :status ORDER BY l.startDate DESC")
    List<Leave> findByUserIdAndStatusOrderByStartDateDesc(@Param("userId") Long userId, @Param("status") Leave.LeaveStatus status);
    
    /**
     * Find leaves by leave type
     */
    List<Leave> findByLeaveTypeOrderByStartDateDesc(Leave.LeaveType leaveType);
    
    /**
     * Find leaves by user and leave type
     */
    List<Leave> findByUserAndLeaveTypeOrderByStartDateDesc(User user, Leave.LeaveType leaveType);
    
    /**
     * Find leaves by user ID and leave type
     */
    @Query("SELECT l FROM Leave l WHERE l.user.id = :userId AND l.leaveType = :leaveType ORDER BY l.startDate DESC")
    List<Leave> findByUserIdAndLeaveTypeOrderByStartDateDesc(@Param("userId") Long userId, @Param("leaveType") Leave.LeaveType leaveType);
    
    /**
     * Find leaves by date range
     */
    @Query("SELECT l FROM Leave l WHERE l.startDate BETWEEN :startDate AND :endDate OR l.endDate BETWEEN :startDate AND :endDate ORDER BY l.startDate DESC")
    List<Leave> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    /**
     * Find leaves by user and date range
     */
    @Query("SELECT l FROM Leave l WHERE l.user.id = :userId AND (l.startDate BETWEEN :startDate AND :endDate OR l.endDate BETWEEN :startDate AND :endDate) ORDER BY l.startDate DESC")
    List<Leave> findByUserIdAndDateRange(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    /**
     * Find leaves by department
     */
    @Query("SELECT l FROM Leave l WHERE l.user.department = :department ORDER BY l.startDate DESC")
    List<Leave> findByDepartmentOrderByStartDateDesc(@Param("department") User.Department department);
    
    /**
     * Find leaves by department and status
     */
    @Query("SELECT l FROM Leave l WHERE l.user.department = :department AND l.status = :status ORDER BY l.startDate DESC")
    List<Leave> findByDepartmentAndStatusOrderByStartDateDesc(@Param("department") User.Department department, @Param("status") Leave.LeaveStatus status);
    
    /**
     * Find leaves by manager (approver)
     */
    @Query("SELECT l FROM Leave l WHERE l.approvedBy.id = :managerId ORDER BY l.startDate DESC")
    List<Leave> findByManagerIdOrderByStartDateDesc(@Param("managerId") Long managerId);
    
    /**
     * Find leaves by manager and status
     */
    @Query("SELECT l FROM Leave l WHERE l.approvedBy.id = :managerId AND l.status = :status ORDER BY l.startDate DESC")
    List<Leave> findByManagerIdAndStatusOrderByStartDateDesc(@Param("managerId") Long managerId, @Param("status") Leave.LeaveStatus status);
    
    /**
     * Find leaves requiring approval by manager
     */
    @Query("SELECT l FROM Leave l WHERE l.user.manager.id = :managerId AND l.status = 'PENDING' ORDER BY l.startDate ASC")
    List<Leave> findPendingLeavesByManagerId(@Param("managerId") Long managerId);
    
    /**
     * Find leaves by year
     */
    @Query("SELECT l FROM Leave l WHERE YEAR(l.startDate) = :year ORDER BY l.startDate DESC")
    List<Leave> findByYearOrderByStartDateDesc(@Param("year") int year);
    
    /**
     * Find leaves by user and year
     */
    @Query("SELECT l FROM Leave l WHERE l.user.id = :userId AND YEAR(l.startDate) = :year ORDER BY l.startDate DESC")
    List<Leave> findByUserIdAndYearOrderByStartDateDesc(@Param("userId") Long userId, @Param("year") int year);
    
    /**
     * Find leaves by month and year
     */
    @Query("SELECT l FROM Leave l WHERE YEAR(l.startDate) = :year AND MONTH(l.startDate) = :month ORDER BY l.startDate DESC")
    List<Leave> findByMonthAndYearOrderByStartDateDesc(@Param("month") int month, @Param("year") int year);
    
    /**
     * Find leaves by user, month, and year
     */
    @Query("SELECT l FROM Leave l WHERE l.user.id = :userId AND YEAR(l.startDate) = :year AND MONTH(l.startDate) = :month ORDER BY l.startDate DESC")
    List<Leave> findByUserIdAndMonthAndYearOrderByStartDateDesc(@Param("userId") Long userId, @Param("month") int month, @Param("year") int year);
    
    /**
     * Count leaves by user and status
     */
    long countByUserAndStatus(User user, Leave.LeaveStatus status);
    
    /**
     * Count leaves by user ID and status
     */
    @Query("SELECT COUNT(l) FROM Leave l WHERE l.user.id = :userId AND l.status = :status")
    long countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") Leave.LeaveStatus status);
    
    /**
     * Count leaves by user and leave type
     */
    long countByUserAndLeaveType(User user, Leave.LeaveType leaveType);
    
    /**
     * Count leaves by user ID and leave type
     */
    @Query("SELECT COUNT(l) FROM Leave l WHERE l.user.id = :userId AND l.leaveType = :leaveType")
    long countByUserIdAndLeaveType(@Param("userId") Long userId, @Param("leaveType") Leave.LeaveType leaveType);
    
    /**
     * Count leaves by user, leave type, and status
     */
    @Query("SELECT COUNT(l) FROM Leave l WHERE l.user.id = :userId AND l.leaveType = :leaveType AND l.status = :status")
    long countByUserIdAndLeaveTypeAndStatus(@Param("userId") Long userId, @Param("leaveType") Leave.LeaveType leaveType, @Param("status") Leave.LeaveStatus status);
    
    /**
     * Count leaves by user and year
     */
    @Query("SELECT COUNT(l) FROM Leave l WHERE l.user.id = :userId AND YEAR(l.startDate) = :year")
    long countByUserIdAndYear(@Param("userId") Long userId, @Param("year") int year);
    
    /**
     * Count leaves by user, leave type, and year
     */
    @Query("SELECT COUNT(l) FROM Leave l WHERE l.user.id = :userId AND l.leaveType = :leaveType AND YEAR(l.startDate) = :year")
    long countByUserIdAndLeaveTypeAndYear(@Param("userId") Long userId, @Param("leaveType") Leave.LeaveType leaveType, @Param("year") int year);
    
    /**
     * Count leaves by user, leave type, status, and year
     */
    @Query("SELECT COUNT(l) FROM Leave l WHERE l.user.id = :userId AND l.leaveType = :leaveType AND l.status = :status AND YEAR(l.startDate) = :year")
    long countByUserIdAndLeaveTypeAndStatusAndYear(@Param("userId") Long userId, @Param("leaveType") Leave.LeaveType leaveType, @Param("status") Leave.LeaveStatus status, @Param("year") int year);
    
    /**
     * Count total days by user, leave type, and year
     */
    @Query("SELECT COUNT(l) FROM Leave l WHERE l.user.id = :userId AND l.leaveType = :leaveType AND l.status = 'APPROVED' AND YEAR(l.startDate) = :year")
    Integer countLeavesByUserIdAndLeaveTypeAndYear(@Param("userId") Long userId, @Param("leaveType") Leave.LeaveType leaveType, @Param("year") int year);
    
    /**
     * Find overlapping leaves for a user
     */
    @Query("SELECT l FROM Leave l WHERE l.user.id = :userId AND l.status IN ('PENDING', 'APPROVED') AND " +
           "((l.startDate BETWEEN :startDate AND :endDate) OR (l.endDate BETWEEN :startDate AND :endDate) OR " +
           "(:startDate BETWEEN l.startDate AND l.endDate) OR (:endDate BETWEEN l.startDate AND l.endDate))")
    List<Leave> findOverlappingLeaves(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    /**
     * Find leaves by department and date range
     */
    @Query("SELECT l FROM Leave l WHERE l.user.department = :department AND " +
           "(l.startDate BETWEEN :startDate AND :endDate OR l.endDate BETWEEN :startDate AND :endDate) ORDER BY l.startDate DESC")
    List<Leave> findByDepartmentAndDateRange(@Param("department") User.Department department, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    /**
     * Find leaves by role
     */
    @Query("SELECT l FROM Leave l WHERE l.user.role = :role ORDER BY l.startDate DESC")
    List<Leave> findByUserRoleOrderByStartDateDesc(@Param("role") User.UserRole role);
    
    /**
     * Find leaves by role and status
     */
    @Query("SELECT l FROM Leave l WHERE l.user.role = :role AND l.status = :status ORDER BY l.startDate DESC")
    List<Leave> findByUserRoleAndStatusOrderByStartDateDesc(@Param("role") User.UserRole role, @Param("status") Leave.LeaveStatus status);
    
    /**
     * Find leaves by role and date range
     */
    @Query("SELECT l FROM Leave l WHERE l.user.role = :role AND " +
           "(l.startDate BETWEEN :startDate AND :endDate OR l.endDate BETWEEN :startDate AND :endDate) ORDER BY l.startDate DESC")
    List<Leave> findByUserRoleAndDateRange(@Param("role") User.UserRole role, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    /**
     * Find leaves by status and date range
     */
    @Query("SELECT l FROM Leave l WHERE l.status = :status AND " +
           "(l.startDate BETWEEN :startDate AND :endDate OR l.endDate BETWEEN :startDate AND :endDate) ORDER BY l.startDate DESC")
    List<Leave> findByStatusAndDateRange(@Param("status") Leave.LeaveStatus status, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    /**
     * Find leaves by leave type and date range
     */
    @Query("SELECT l FROM Leave l WHERE l.leaveType = :leaveType AND " +
           "(l.startDate BETWEEN :startDate AND :endDate OR l.endDate BETWEEN :startDate AND :endDate) ORDER BY l.startDate DESC")
    List<Leave> findByLeaveTypeAndDateRange(@Param("leaveType") Leave.LeaveType leaveType, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    /**
     * Find leaves by leave type and status
     */
    List<Leave> findByLeaveTypeAndStatusOrderByStartDateDesc(Leave.LeaveType leaveType, Leave.LeaveStatus status);
    
    /**
     * Find leaves by leave type, status, and date range
     */
    @Query("SELECT l FROM Leave l WHERE l.leaveType = :leaveType AND l.status = :status AND " +
           "(l.startDate BETWEEN :startDate AND :endDate OR l.endDate BETWEEN :startDate AND :endDate) ORDER BY l.startDate DESC")
    List<Leave> findByLeaveTypeAndStatusAndDateRange(@Param("leaveType") Leave.LeaveType leaveType, @Param("status") Leave.LeaveStatus status, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    /**
     * Find leaves by user ID
     */
    List<Leave> findByUserId(Long userId);
    
    /**
     * Find leaves by status
     */
    List<Leave> findByStatus(Leave.LeaveStatus status);
    
    /**
     * Find leaves by leave type
     */
    List<Leave> findByLeaveType(Leave.LeaveType leaveType);
    
    /**
     * Count leaves by status
     */
    long countByStatus(Leave.LeaveStatus status);
    
    /**
     * Count leaves by user ID
     */
    long countByUserId(Long userId);
    
    /**
     * Check if leave exists by ID and user ID
     */
    boolean existsByIdAndUserId(Long id, Long userId);
    
    // Paginated methods for filtering
    /**
     * Find leaves by user ID with pagination
     */
    org.springframework.data.domain.Page<Leave> findByUserId(Long userId, org.springframework.data.domain.Pageable pageable);
    
    /**
     * Find leaves by leave type with pagination
     */
    org.springframework.data.domain.Page<Leave> findByLeaveType(Leave.LeaveType leaveType, org.springframework.data.domain.Pageable pageable);
    
    /**
     * Find leaves by status with pagination
     */
    org.springframework.data.domain.Page<Leave> findByStatus(Leave.LeaveStatus status, org.springframework.data.domain.Pageable pageable);
    
    /**
     * Find leaves by user ID and leave type with pagination
     */
    org.springframework.data.domain.Page<Leave> findByUserIdAndLeaveType(Long userId, Leave.LeaveType leaveType, org.springframework.data.domain.Pageable pageable);
    
    /**
     * Find leaves by user ID and status with pagination
     */
    org.springframework.data.domain.Page<Leave> findByUserIdAndStatus(Long userId, Leave.LeaveStatus status, org.springframework.data.domain.Pageable pageable);
    
    /**
     * Find leaves by leave type and status with pagination
     */
    org.springframework.data.domain.Page<Leave> findByLeaveTypeAndStatus(Leave.LeaveType leaveType, Leave.LeaveStatus status, org.springframework.data.domain.Pageable pageable);
    
    /**
     * Find leaves by reason containing search query with pagination
     */
    org.springframework.data.domain.Page<Leave> findByReasonContainingIgnoreCase(String query, org.springframework.data.domain.Pageable pageable);
    
    /**
     * Find leaves by user ID, leave type, and status with pagination
     */
    org.springframework.data.domain.Page<Leave> findByUserIdAndLeaveTypeAndStatus(Long userId, Leave.LeaveType leaveType, Leave.LeaveStatus status, org.springframework.data.domain.Pageable pageable);
    
    /**
     * Find leaves by user ID, leave type, status, start date range, and reason containing search query with pagination
     */
    @Query("SELECT l FROM Leave l WHERE l.user.id = :userId AND l.leaveType = :leaveType AND l.status = :status AND l.startDate BETWEEN :startDate AND :endDate AND l.reason LIKE %:query%")
    org.springframework.data.domain.Page<Leave> findByUserIdAndLeaveTypeAndStatusAndStartDateBetweenAndReasonContainingIgnoreCase(
        @Param("userId") Long userId, 
        @Param("leaveType") Leave.LeaveType leaveType, 
        @Param("status") Leave.LeaveStatus status, 
        @Param("startDate") java.time.LocalDate startDate, 
        @Param("endDate") java.time.LocalDate endDate, 
        @Param("query") String query, 
        org.springframework.data.domain.Pageable pageable);
} 
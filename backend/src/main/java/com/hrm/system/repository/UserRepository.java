package com.hrm.system.repository;

import com.hrm.system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for User entity
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Find user by email
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Find user by employee ID
     */
    Optional<User> findByEmployeeId(String employeeId);
    
    /**
     * Find users by role
     */
    List<User> findByRole(User.UserRole role);
    
    /**
     * Find users by department
     */
    List<User> findByDepartment(User.Department department);
    
    /**
     * Find users by status
     */
    List<User> findByStatus(User.UserStatus status);
    
    /**
     * Find users by manager
     */
    List<User> findByManager(User manager);
    
    /**
     * Find users who joined after a specific date
     */
    List<User> findByDateOfJoiningAfter(LocalDateTime date);
    
    /**
     * Find users by role and department
     */
    List<User> findByRoleAndDepartment(User.UserRole role, User.Department department);
    
    /**
     * Find users by role and status
     */
    List<User> findByRoleAndStatus(User.UserRole role, User.UserStatus status);
    
    /**
     * Check if email exists
     */
    boolean existsByEmail(String email);
    
    /**
     * Check if employee ID exists
     */
    boolean existsByEmployeeId(String employeeId);
    
    /**
     * Find users by department and status
     */
    List<User> findByDepartmentAndStatus(User.Department department, User.UserStatus status);
    
    /**
     * Count users by department
     */
    long countByDepartment(User.Department department);
    
    /**
     * Count users by role
     */
    long countByRole(User.UserRole role);
    
    /**
     * Count active users
     */
    long countByStatus(User.UserStatus status);
    
    /**
     * Find users with last login before a specific date
     */
    @Query("SELECT u FROM User u WHERE u.lastLoginAt < :date")
    List<User> findUsersWithLastLoginBefore(@Param("date") LocalDateTime date);
    
    /**
     * Find users by name pattern (first name or last name)
     */
    @Query("SELECT u FROM User u WHERE LOWER(u.firstName) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<User> findByNameContainingIgnoreCase(@Param("name") String name);
    
    /**
     * Find users by email pattern
     */
    @Query("SELECT u FROM User u WHERE LOWER(u.email) LIKE LOWER(CONCAT('%', :email, '%'))")
    List<User> findByEmailContainingIgnoreCase(@Param("email") String email);
    
    /**
     * Find users by phone number pattern
     */
    @Query("SELECT u FROM User u WHERE u.phoneNumber LIKE CONCAT('%', :phone, '%')")
    List<User> findByPhoneNumberContaining(@Param("phone") String phone);
    
    /**
     * Find users who are managers (have subordinates)
     */
    @Query("SELECT DISTINCT u FROM User u WHERE u.id IN (SELECT DISTINCT u2.manager.id FROM User u2 WHERE u2.manager IS NOT NULL)")
    List<User> findManagers();
    
    /**
     * Find users who are not managers (no subordinates)
     */
    @Query("SELECT u FROM User u WHERE u.id NOT IN (SELECT DISTINCT u2.manager.id FROM User u2 WHERE u2.manager IS NOT NULL)")
    List<User> findNonManagers();
    
    /**
     * Find users by multiple departments
     */
    @Query("SELECT u FROM User u WHERE u.department IN :departments")
    List<User> findByDepartments(@Param("departments") List<User.Department> departments);
    
    /**
     * Find users by multiple roles
     */
    @Query("SELECT u FROM User u WHERE u.role IN :roles")
    List<User> findByRoles(@Param("roles") List<User.UserRole> roles);
    
    /**
     * Find users created between dates
     */
    @Query("SELECT u FROM User u WHERE u.createdAt BETWEEN :startDate AND :endDate")
    List<User> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    /**
     * Find users who joined in a specific year
     */
    @Query("SELECT u FROM User u WHERE YEAR(u.dateOfJoining) = :year")
    List<User> findByJoiningYear(@Param("year") int year);
    
    /**
     * Find users who joined in a specific month and year
     */
    @Query("SELECT u FROM User u WHERE YEAR(u.dateOfJoining) = :year AND MONTH(u.dateOfJoining) = :month")
    List<User> findByJoiningMonthAndYear(@Param("month") int month, @Param("year") int year);
    
    /**
     * Find users by manager ID
     */
    @Query("SELECT u FROM User u WHERE u.manager.id = :managerId")
    List<User> findByManagerId(@Param("managerId") Long managerId);
    
    /**
     * Search users by name, email, or employee ID
     */
    @Query("SELECT u FROM User u WHERE LOWER(u.firstName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(u.employeeId) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<User> searchUsers(@Param("query") String query);
    
    /**
     * Count new hires this month
     */
    @Query("SELECT COUNT(u) FROM User u WHERE YEAR(u.dateOfJoining) = YEAR(CURRENT_DATE) AND MONTH(u.dateOfJoining) = MONTH(CURRENT_DATE)")
    long countNewHiresThisMonth();
} 
package com.hrm.system.repository;

import com.hrm.system.entity.Attendance;
import com.hrm.system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Attendance entity
 */
@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    
    /**
     * Find attendance by user and date
     */
    Optional<Attendance> findByUserAndDate(User user, LocalDate date);
    
    /**
     * Find attendance by user ID and date
     */
    @Query("SELECT a FROM Attendance a WHERE a.user.id = :userId AND a.date = :date")
    Optional<Attendance> findByUserIdAndDate(@Param("userId") Long userId, @Param("date") LocalDate date);
    
    /**
     * Find all attendance records for a user
     */
    List<Attendance> findByUserOrderByDateDesc(User user);
    
    /**
     * Find all attendance records for a user ID
     */
    @Query("SELECT a FROM Attendance a WHERE a.user.id = :userId ORDER BY a.date DESC")
    List<Attendance> findByUserIdOrderByDateDesc(@Param("userId") Long userId);
    
    /**
     * Find all attendance records for a specific date
     */
    List<Attendance> findByDateOrderByUserFirstNameAsc(LocalDate date);
    
    /**
     * Find attendance records by user and date range
     */
    @Query("SELECT a FROM Attendance a WHERE a.user.id = :userId AND a.date BETWEEN :startDate AND :endDate ORDER BY a.date DESC")
    List<Attendance> findByUserIdAndDateBetween(@Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    /**
     * Find attendance records by department and date
     */
    @Query("SELECT a FROM Attendance a WHERE a.user.department = :department AND a.date = :date ORDER BY a.user.firstName ASC")
    List<Attendance> findByDepartmentAndDate(@Param("department") User.Department department, @Param("date") LocalDate date);
    
    /**
     * Find attendance records by status
     */
    List<Attendance> findByStatusOrderByDateDesc(Attendance.AttendanceStatus status);
    
    /**
     * Find attendance records by status and date
     */
    List<Attendance> findByStatusAndDate(Attendance.AttendanceStatus status, LocalDate date);
    
    /**
     * Find attendance records by user and status
     */
    List<Attendance> findByUserAndStatusOrderByDateDesc(User user, Attendance.AttendanceStatus status);
    
    /**
     * Find attendance records by user ID and status
     */
    @Query("SELECT a FROM Attendance a WHERE a.user.id = :userId AND a.status = :status ORDER BY a.date DESC")
    List<Attendance> findByUserIdAndStatusOrderByDateDesc(@Param("userId") Long userId, @Param("status") Attendance.AttendanceStatus status);
    
    /**
     * Find attendance records by user and date range with status
     */
    @Query("SELECT a FROM Attendance a WHERE a.user.id = :userId AND a.date BETWEEN :startDate AND :endDate AND a.status = :status ORDER BY a.date DESC")
    List<Attendance> findByUserIdAndDateBetweenAndStatus(@Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("status") Attendance.AttendanceStatus status);
    
    /**
     * Find attendance records by manager's team and date
     */
    @Query("SELECT a FROM Attendance a WHERE a.user.manager.id = :managerId AND a.date = :date ORDER BY a.user.firstName ASC")
    List<Attendance> findByManagerIdAndDate(@Param("managerId") Long managerId, @Param("date") LocalDate date);
    
    /**
     * Find attendance records by manager's team and date range
     */
    @Query("SELECT a FROM Attendance a WHERE a.user.manager.id = :managerId AND a.date BETWEEN :startDate AND :endDate ORDER BY a.date DESC, a.user.firstName ASC")
    List<Attendance> findByManagerIdAndDateBetween(@Param("managerId") Long managerId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    /**
     * Count attendance records by user and date range
     */
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.user.id = :userId AND a.date BETWEEN :startDate AND :endDate")
    long countByUserIdAndDateBetween(@Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    /**
     * Count attendance records by user, date range, and status
     */
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.user.id = :userId AND a.date BETWEEN :startDate AND :endDate AND a.status = :status")
    long countByUserIdAndDateBetweenAndStatus(@Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("status") Attendance.AttendanceStatus status);
    
    /**
     * Count attendance records by date and status
     */
    long countByDateAndStatus(LocalDate date, Attendance.AttendanceStatus status);
    
    /**
     * Count attendance records by department and date
     */
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.user.department = :department AND a.date = :date")
    long countByDepartmentAndDate(@Param("department") User.Department department, @Param("date") LocalDate date);
    
    /**
     * Count attendance records by department, date, and status
     */
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.user.department = :department AND a.date = :date AND a.status = :status")
    long countByDepartmentAndDateAndStatus(@Param("department") User.Department department, @Param("date") LocalDate date, @Param("status") Attendance.AttendanceStatus status);
    
    /**
     * Find late arrivals (punch in after 9:00 AM)
     */
    @Query("SELECT a FROM Attendance a WHERE a.date = :date AND a.punchInTime > :lateTime AND a.status = 'PRESENT' ORDER BY a.punchInTime ASC")
    List<Attendance> findLateArrivals(@Param("date") LocalDate date, @Param("lateTime") LocalTime lateTime);
    
    /**
     * Find early departures (punch out before 5:00 PM)
     */
    @Query("SELECT a FROM Attendance a WHERE a.date = :date AND a.punchOutTime < :earlyTime AND a.status = 'PRESENT' ORDER BY a.punchOutTime DESC")
    List<Attendance> findEarlyDepartures(@Param("date") LocalDate date, @Param("earlyTime") LocalTime earlyTime);
    
    /**
     * Find attendance records with incomplete punch out
     */
    @Query("SELECT a FROM Attendance a WHERE a.date = :date AND a.punchInTime IS NOT NULL AND a.punchOutTime IS NULL")
    List<Attendance> findIncompleteAttendance(@Param("date") LocalDate date);
    
    /**
     * Find attendance records by month and year
     */
    @Query("SELECT a FROM Attendance a WHERE YEAR(a.date) = :year AND MONTH(a.date) = :month ORDER BY a.date DESC, a.user.firstName ASC")
    List<Attendance> findByMonthAndYear(@Param("month") int month, @Param("year") int year);
    
    /**
     * Find attendance records by user, month, and year
     */
    @Query("SELECT a FROM Attendance a WHERE a.user.id = :userId AND YEAR(a.date) = :year AND MONTH(a.date) = :month ORDER BY a.date DESC")
    List<Attendance> findByUserIdAndMonthAndYear(@Param("userId") Long userId, @Param("month") int month, @Param("year") int year);
    
    /**
     * Find attendance records by user and year
     */
    @Query("SELECT a FROM Attendance a WHERE a.user.id = :userId AND YEAR(a.date) = :year ORDER BY a.date DESC")
    List<Attendance> findByUserIdAndYear(@Param("userId") Long userId, @Param("year") int year);
    
    /**
     * Check if user has attendance record for a specific date
     */
    boolean existsByUserAndDate(User user, LocalDate date);
    
    /**
     * Check if user has attendance record for a specific date
     */
    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Attendance a WHERE a.user.id = :userId AND a.date = :date")
    boolean existsByUserIdAndDate(@Param("userId") Long userId, @Param("date") LocalDate date);
    
    /**
     * Find attendance records with working hours less than specified
     */
    @Query("SELECT a FROM Attendance a WHERE a.date = :date AND a.punchInTime IS NOT NULL AND a.punchOutTime IS NOT NULL AND (a.punchOutTime - a.punchInTime) < :minHours ORDER BY a.user.firstName ASC")
    List<Attendance> findShortWorkingHours(@Param("date") LocalDate date, @Param("minHours") long minHours);
    
    /**
     * Find attendance records with overtime (working hours more than specified)
     */
    @Query("SELECT a FROM Attendance a WHERE a.date = :date AND a.punchInTime IS NOT NULL AND a.punchOutTime IS NOT NULL AND (a.punchOutTime - a.punchInTime) > :maxHours ORDER BY a.user.firstName ASC")
    List<Attendance> findOvertime(@Param("date") LocalDate date, @Param("maxHours") long maxHours);
} 
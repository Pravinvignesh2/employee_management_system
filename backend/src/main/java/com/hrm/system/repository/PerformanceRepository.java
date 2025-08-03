package com.hrm.system.repository;

import com.hrm.system.entity.Performance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository interface for Performance entity
 */
@Repository
public interface PerformanceRepository extends JpaRepository<Performance, Long> {
    
    /**
     * Find performance reviews by user ID ordered by review period descending
     */
    @Query("SELECT p FROM Performance p WHERE p.user.id = :userId ORDER BY p.reviewPeriod DESC")
    List<Performance> findByUserIdOrderByReviewPeriodDesc(@Param("userId") Long userId);
    
    /**
     * Find performance reviews by status ordered by review period descending
     */
    List<Performance> findByStatusOrderByReviewPeriodDesc(Performance.PerformanceStatus status);
    
    /**
     * Find performance reviews by review type ordered by review period descending
     */
    List<Performance> findByReviewTypeOrderByReviewPeriodDesc(Performance.ReviewType reviewType);
    
    /**
     * Find performance reviews by user ID and status
     */
    @Query("SELECT p FROM Performance p WHERE p.user.id = :userId AND p.status = :status ORDER BY p.reviewPeriod DESC")
    List<Performance> findByUserIdAndStatusOrderByReviewPeriodDesc(@Param("userId") Long userId, @Param("status") Performance.PerformanceStatus status);
    
    /**
     * Find performance reviews by overall rating greater than or equal to value
     */
    List<Performance> findByOverallRatingGreaterThanEqualOrderByOverallRatingDesc(Integer rating);
    
    /**
     * Find performance reviews by user department ordered by review period descending
     */
    @Query("SELECT p FROM Performance p WHERE p.user.department = :department ORDER BY p.reviewPeriod DESC")
    List<Performance> findByUserDepartmentOrderByReviewPeriodDesc(@Param("department") String department);
    
    /**
     * Find performance reviews by review period
     */
    List<Performance> findByReviewPeriodOrderByUserEmployeeId(LocalDate reviewPeriod);
    
    /**
     * Find performance reviews by user ID and review period
     */
    @Query("SELECT p FROM Performance p WHERE p.user.id = :userId AND p.reviewPeriod = :reviewPeriod")
    List<Performance> findByUserIdAndReviewPeriod(@Param("userId") Long userId, @Param("reviewPeriod") LocalDate reviewPeriod);
    
    /**
     * Count performance reviews by user ID
     */
    long countByUserId(Long userId);
    
    /**
     * Count performance reviews by status
     */
    long countByStatus(Performance.PerformanceStatus status);
    
    /**
     * Count performance reviews by user ID and status
     */
    @Query("SELECT COUNT(p) FROM Performance p WHERE p.user.id = :userId AND p.status = :status")
    long countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") Performance.PerformanceStatus status);
    
    /**
     * Count performance reviews by review period
     */
    long countByReviewPeriod(LocalDate reviewPeriod);
    
    /**
     * Check if performance review exists by ID and user ID
     */
    @Query("SELECT COUNT(p) > 0 FROM Performance p WHERE p.id = :id AND p.user.id = :userId")
    boolean existsByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);
    
    /**
     * Find performance reviews by department and status
     */
    @Query("SELECT p FROM Performance p WHERE p.user.department = :department AND p.status = :status ORDER BY p.reviewPeriod DESC")
    List<Performance> findByDepartmentAndStatusOrderByReviewPeriodDesc(@Param("department") String department, @Param("status") Performance.PerformanceStatus status);
    
    /**
     * Find performance reviews by date range
     */
    @Query("SELECT p FROM Performance p WHERE p.reviewPeriod BETWEEN :startDate AND :endDate ORDER BY p.reviewPeriod DESC")
    List<Performance> findByReviewPeriodBetweenOrderByReviewPeriodDesc(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    /**
     * Find performance reviews by user ID and date range
     */
    @Query("SELECT p FROM Performance p WHERE p.user.id = :userId AND p.reviewPeriod BETWEEN :startDate AND :endDate ORDER BY p.reviewPeriod DESC")
    List<Performance> findByUserIdAndReviewPeriodBetweenOrderByReviewPeriodDesc(@Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    /**
     * Find performance reviews by year
     */
    @Query("SELECT p FROM Performance p WHERE YEAR(p.reviewPeriod) = :year ORDER BY p.reviewPeriod DESC")
    List<Performance> findByYearOrderByReviewPeriodDesc(@Param("year") int year);
    
    /**
     * Find performance reviews by user ID and year
     */
    @Query("SELECT p FROM Performance p WHERE p.user.id = :userId AND YEAR(p.reviewPeriod) = :year ORDER BY p.reviewPeriod DESC")
    List<Performance> findByUserIdAndYearOrderByReviewPeriodDesc(@Param("userId") Long userId, @Param("year") int year);
    
    /**
     * Find performance reviews by month and year
     */
    @Query("SELECT p FROM Performance p WHERE YEAR(p.reviewPeriod) = :year AND MONTH(p.reviewPeriod) = :month ORDER BY p.reviewPeriod DESC")
    List<Performance> findByMonthAndYearOrderByReviewPeriodDesc(@Param("month") int month, @Param("year") int year);
    
    /**
     * Find performance reviews by user ID, month, and year
     */
    @Query("SELECT p FROM Performance p WHERE p.user.id = :userId AND YEAR(p.reviewPeriod) = :year AND MONTH(p.reviewPeriod) = :month ORDER BY p.reviewPeriod DESC")
    List<Performance> findByUserIdAndMonthAndYearOrderByReviewPeriodDesc(@Param("userId") Long userId, @Param("month") int month, @Param("year") int year);
    
    /**
     * Count performance reviews by year
     */
    @Query("SELECT COUNT(p) FROM Performance p WHERE YEAR(p.reviewPeriod) = :year")
    long countByYear(@Param("year") int year);
    
    /**
     * Count performance reviews by user ID and year
     */
    @Query("SELECT COUNT(p) FROM Performance p WHERE p.user.id = :userId AND YEAR(p.reviewPeriod) = :year")
    long countByUserIdAndYear(@Param("userId") Long userId, @Param("year") int year);
    
    /**
     * Count performance reviews by month and year
     */
    @Query("SELECT COUNT(p) FROM Performance p WHERE YEAR(p.reviewPeriod) = :year AND MONTH(p.reviewPeriod) = :month")
    long countByMonthAndYear(@Param("month") int month, @Param("year") int year);
    
    /**
     * Count performance reviews by user ID, month, and year
     */
    @Query("SELECT COUNT(p) FROM Performance p WHERE p.user.id = :userId AND YEAR(p.reviewPeriod) = :year AND MONTH(p.reviewPeriod) = :month")
    long countByUserIdAndMonthAndYear(@Param("userId") Long userId, @Param("month") int month, @Param("year") int year);
} 
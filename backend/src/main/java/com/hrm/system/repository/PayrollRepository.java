package com.hrm.system.repository;

import com.hrm.system.entity.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.YearMonth;
import java.util.List;

/**
 * Repository interface for Payroll entity
 */
@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    
    /**
     * Find payroll by user ID ordered by pay period descending
     */
    @Query("SELECT p FROM Payroll p WHERE p.user.id = :userId ORDER BY p.payPeriod DESC")
    List<Payroll> findByUserIdOrderByPayPeriodDesc(@Param("userId") Long userId);
    
    /**
     * Find payroll by payment status ordered by pay period descending
     */
    List<Payroll> findByPaymentStatusOrderByPayPeriodDesc(Payroll.PaymentStatus paymentStatus);
    
    /**
     * Find payroll by user ID and payment status
     */
    @Query("SELECT p FROM Payroll p WHERE p.user.id = :userId AND p.paymentStatus = :status ORDER BY p.payPeriod DESC")
    List<Payroll> findByUserIdAndPaymentStatusOrderByPayPeriodDesc(@Param("userId") Long userId, @Param("status") Payroll.PaymentStatus status);
    
    /**
     * Find payroll by pay period
     */
    List<Payroll> findByPayPeriodOrderByUserEmployeeId(YearMonth payPeriod);
    
    /**
     * Find payroll by user ID and pay period
     */
    @Query("SELECT p FROM Payroll p WHERE p.user.id = :userId AND p.payPeriod = :payPeriod")
    List<Payroll> findByUserIdAndPayPeriod(@Param("userId") Long userId, @Param("payPeriod") YearMonth payPeriod);
    
    /**
     * Count payroll by user ID
     */
    long countByUserId(Long userId);
    
    /**
     * Count payroll by payment status
     */
    long countByPaymentStatus(Payroll.PaymentStatus paymentStatus);
    
    /**
     * Count payroll by user ID and payment status
     */
    @Query("SELECT COUNT(p) FROM Payroll p WHERE p.user.id = :userId AND p.paymentStatus = :status")
    long countByUserIdAndPaymentStatus(@Param("userId") Long userId, @Param("status") Payroll.PaymentStatus status);
    
    /**
     * Count payroll by pay period
     */
    long countByPayPeriod(YearMonth payPeriod);
    
    /**
     * Check if payroll exists by ID and user ID
     */
    @Query("SELECT COUNT(p) > 0 FROM Payroll p WHERE p.id = :id AND p.user.id = :userId")
    boolean existsByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);
    
    /**
     * Find payroll by department
     */
    @Query("SELECT p FROM Payroll p WHERE p.user.department = :department ORDER BY p.payPeriod DESC")
    List<Payroll> findByDepartmentOrderByPayPeriodDesc(@Param("department") String department);
    
    /**
     * Find payroll by department and payment status
     */
    @Query("SELECT p FROM Payroll p WHERE p.user.department = :department AND p.paymentStatus = :status ORDER BY p.payPeriod DESC")
    List<Payroll> findByDepartmentAndPaymentStatusOrderByPayPeriodDesc(@Param("department") String department, @Param("status") Payroll.PaymentStatus status);
    
    /**
     * Find payroll by date range
     */
    @Query("SELECT p FROM Payroll p WHERE p.payPeriod BETWEEN :startPeriod AND :endPeriod ORDER BY p.payPeriod DESC")
    List<Payroll> findByPayPeriodBetweenOrderByPayPeriodDesc(@Param("startPeriod") YearMonth startPeriod, @Param("endPeriod") YearMonth endPeriod);
    
    /**
     * Find payroll by user ID and date range
     */
    @Query("SELECT p FROM Payroll p WHERE p.user.id = :userId AND p.payPeriod BETWEEN :startPeriod AND :endPeriod ORDER BY p.payPeriod DESC")
    List<Payroll> findByUserIdAndPayPeriodBetweenOrderByPayPeriodDesc(@Param("userId") Long userId, @Param("startPeriod") YearMonth startPeriod, @Param("endPeriod") YearMonth endPeriod);
    

} 
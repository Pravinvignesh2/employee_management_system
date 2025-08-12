package com.hrm.system.repository;

import com.hrm.system.entity.Appraisal;
import com.hrm.system.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppraisalRepository extends JpaRepository<Appraisal, Long> {

    // Find appraisals by employee
    List<Appraisal> findByEmployeeOrderByAppraisalDateDesc(User employee);

    // Find completed appraisals by employee ordered by date asc/desc
    List<Appraisal> findByEmployeeAndStatusOrderByAppraisalDateAsc(User employee, Appraisal.AppraisalStatus status);

    List<Appraisal> findByEmployeeAndStatusOrderByAppraisalDateDesc(User employee, Appraisal.AppraisalStatus status);

    // Find appraisals by manager
    List<Appraisal> findByManagerOrderByAppraisalDateDesc(User manager);

    // Find appraisals by status
    List<Appraisal> findByStatus(Appraisal.AppraisalStatus status);

    // Find appraisals by employee and status
    List<Appraisal> findByEmployeeAndStatus(User employee, Appraisal.AppraisalStatus status);

    // Find appraisals by employee and status in list
    @Query("SELECT a FROM Appraisal a WHERE a.employee = :employee AND a.status IN :statuses ORDER BY a.appraisalDate DESC")
    List<Appraisal> findByEmployeeAndStatusInOrderByAppraisalDateDesc(@Param("employee") User employee,
            @Param("statuses") List<Appraisal.AppraisalStatus> statuses);

    // Find appraisals by manager and status
    List<Appraisal> findByManagerAndStatus(User manager, Appraisal.AppraisalStatus status);

    // Find appraisals by period
    List<Appraisal> findByPeriod(String period);

    // Find appraisals by employee and period
    List<Appraisal> findByEmployeeAndPeriod(User employee, String period);

    // Find appraisals by manager and period
    List<Appraisal> findByManagerAndPeriod(User manager, String period);

    // Find appraisals with pagination
    Page<Appraisal> findByEmployee(User employee, Pageable pageable);

    Page<Appraisal> findByManager(User manager, Pageable pageable);

    // Find appraisals by department (for managers)
    @Query("SELECT a FROM Appraisal a WHERE a.employee.department = :department")
    List<Appraisal> findByDepartment(@Param("department") User.Department department);

    // Find appraisals by department and status
    @Query("SELECT a FROM Appraisal a WHERE a.employee.department = :department AND a.status = :status")
    List<Appraisal> findByDepartmentAndStatus(@Param("department") User.Department department,
            @Param("status") Appraisal.AppraisalStatus status);

    // Find appraisals by department and period
    @Query("SELECT a FROM Appraisal a WHERE a.employee.department = :department AND a.period = :period")
    List<Appraisal> findByDepartmentAndPeriod(@Param("department") User.Department department,
            @Param("period") String period);

    // Count appraisals by status for an employee
    long countByEmployeeAndStatus(User employee, Appraisal.AppraisalStatus status);

    // Count appraisals by status for a manager
    long countByManagerAndStatus(User manager, Appraisal.AppraisalStatus status);

    // Count appraisals by status for a department
    @Query("SELECT COUNT(a) FROM Appraisal a WHERE a.employee.department = :department AND a.status = :status")
    long countByDepartmentAndStatus(@Param("department") User.Department department,
            @Param("status") Appraisal.AppraisalStatus status);

    // Find pending appraisals
    @Query("SELECT a FROM Appraisal a WHERE a.status = 'DRAFT' OR a.status = 'SUBMITTED'")
    List<Appraisal> findPendingAppraisals();

    // Find pending appraisals for a specific manager
    @Query("SELECT a FROM Appraisal a WHERE a.manager = :manager AND (a.status = 'DRAFT' OR a.status = 'SUBMITTED')")
    List<Appraisal> findPendingAppraisalsForManager(@Param("manager") User manager);

    // Find high-rated appraisals (4.0+ rating)
    @Query("SELECT a FROM Appraisal a WHERE a.rating >= 4.0")
    List<Appraisal> findHighRatedAppraisals();

    // Find low-rated appraisals (below 3.0 rating)
    @Query("SELECT a FROM Appraisal a WHERE a.rating < 3.0")
    List<Appraisal> findLowRatedAppraisals();

    // Find appraisals by rating range
    @Query("SELECT a FROM Appraisal a WHERE a.rating BETWEEN :minRating AND :maxRating")
    List<Appraisal> findByRatingRange(@Param("minRating") Double minRating, @Param("maxRating") Double maxRating);

    // Find completed appraisals
    @Query("SELECT a FROM Appraisal a WHERE a.status = 'COMPLETED'")
    List<Appraisal> findCompletedAppraisals();

    // Find completed appraisals for a department
    @Query("SELECT a FROM Appraisal a WHERE a.employee.department = :department AND a.status = 'COMPLETED'")
    List<Appraisal> findCompletedAppraisalsByDepartment(@Param("department") User.Department department);

    // Find appraisals by year
    @Query("SELECT a FROM Appraisal a WHERE a.period LIKE %:year%")
    List<Appraisal> findByYear(@Param("year") String year);

    // Find appraisals by year and department
    @Query("SELECT a FROM Appraisal a WHERE a.employee.department = :department AND a.period LIKE %:year%")
    List<Appraisal> findByYearAndDepartment(@Param("year") String year,
            @Param("department") User.Department department);

    // Find average rating by department
    @Query("SELECT AVG(a.rating) FROM Appraisal a WHERE a.employee.department = :department AND a.status = 'COMPLETED'")
    Double findAverageRatingByDepartment(@Param("department") User.Department department);

    // Find average rating by period
    @Query("SELECT AVG(a.rating) FROM Appraisal a WHERE a.period = :period AND a.status = 'COMPLETED'")
    Double findAverageRatingByPeriod(@Param("period") String period);
}
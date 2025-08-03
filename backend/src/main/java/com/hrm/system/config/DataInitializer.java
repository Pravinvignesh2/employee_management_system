package com.hrm.system.config;

import com.hrm.system.entity.*;
import com.hrm.system.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Data initializer to populate the database with sample data
 */
@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PerformanceGoalRepository performanceGoalRepository;
    
    @Autowired
    private AppraisalRepository appraisalRepository;
    
    @Autowired
    private FeedbackRepository feedbackRepository;
    
    @Autowired
    private AISuggestionRepository aiSuggestionRepository;
    

    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Initialize users first
        initializeUsers();
        
        // Initialize performance data
        initializePerformanceData();
    }
    
    private void initializeUsers() {
        // Initialize users if none exist
        if (userRepository.count() == 0) {
            initializeSampleData();
        }
    }
    
    private void initializeSampleData() {
        // Create Admin User
        User admin = new User();
        admin.setEmployeeId("EMP001");
        admin.setFirstName("Admin");
        admin.setLastName("User");
        admin.setEmail("admin@hrm.com");
        admin.setPassword(passwordEncoder.encode("password123"));
        admin.setPhoneNumber("+1234567890");
        admin.setRole(User.UserRole.ADMIN);
        admin.setDepartment(User.Department.HR);
        admin.setStatus(User.UserStatus.ACTIVE);
        admin.setDateOfJoining(LocalDateTime.now().minusYears(2));
        admin.setAddress("123 Admin Street, City, State 12345");
        admin.setEmergencyContact("+1987654321");
        userRepository.save(admin);
        
        // Create Manager User
        User manager = new User();
        manager.setEmployeeId("EMP002");
        manager.setFirstName("John");
        manager.setLastName("Manager");
        manager.setEmail("manager@hrm.com");
        manager.setPassword(passwordEncoder.encode("password123"));
        manager.setPhoneNumber("+1234567891");
        manager.setRole(User.UserRole.MANAGER);
        manager.setDepartment(User.Department.IT);
        manager.setStatus(User.UserStatus.ACTIVE);
        manager.setDateOfJoining(LocalDateTime.now().minusYears(1));
        manager.setAddress("456 Manager Avenue, City, State 12345");
        manager.setEmergencyContact("+1987654322");
        userRepository.save(manager);
        
        // Create Employee Users
        User employee1 = new User();
        employee1.setEmployeeId("EMP003");
        employee1.setFirstName("Jane");
        employee1.setLastName("Employee");
        employee1.setEmail("employee@hrm.com");
        employee1.setPassword(passwordEncoder.encode("password123"));
        employee1.setPhoneNumber("+1234567892");
        employee1.setRole(User.UserRole.EMPLOYEE);
        employee1.setDepartment(User.Department.IT);
        employee1.setStatus(User.UserStatus.ACTIVE);
        employee1.setDateOfJoining(LocalDateTime.now().minusMonths(6));
        employee1.setAddress("789 Employee Road, City, State 12345");
        employee1.setEmergencyContact("+1987654323");
        employee1.setManager(manager);
        userRepository.save(employee1);
        
        User employee2 = new User();
        employee2.setEmployeeId("EMP004");
        employee2.setFirstName("Mike");
        employee2.setLastName("Support");
        employee2.setEmail("support@hrm.com");
        employee2.setPassword(passwordEncoder.encode("password123"));
        employee2.setPhoneNumber("+1234567893");
        employee2.setRole(User.UserRole.IT_SUPPORT);
        employee2.setDepartment(User.Department.IT);
        employee2.setStatus(User.UserStatus.ACTIVE);
        employee2.setDateOfJoining(LocalDateTime.now().minusMonths(3));
        employee2.setAddress("321 Support Lane, City, State 12345");
        employee2.setEmergencyContact("+1987654324");
        employee2.setManager(manager);
        userRepository.save(employee2);
        
        User employee3 = new User();
        employee3.setEmployeeId("EMP005");
        employee3.setFirstName("Sarah");
        employee3.setLastName("Johnson");
        employee3.setEmail("sarah@hrm.com");
        employee3.setPassword(passwordEncoder.encode("password123"));
        employee3.setPhoneNumber("+1234567894");
        employee3.setRole(User.UserRole.EMPLOYEE);
        employee3.setDepartment(User.Department.FINANCE);
        employee3.setStatus(User.UserStatus.ACTIVE);
        employee3.setDateOfJoining(LocalDateTime.now().minusMonths(9));
        employee3.setAddress("654 Finance Blvd, City, State 12345");
        employee3.setEmergencyContact("+1987654325");
        userRepository.save(employee3);
        
        User employee4 = new User();
        employee4.setEmployeeId("EMP006");
        employee4.setFirstName("David");
        employee4.setLastName("Wilson");
        employee4.setEmail("david@hrm.com");
        employee4.setPassword(passwordEncoder.encode("password123"));
        employee4.setPhoneNumber("+1234567895");
        employee4.setRole(User.UserRole.EMPLOYEE);
        employee4.setDepartment(User.Department.MARKETING);
        employee4.setStatus(User.UserStatus.ACTIVE);
        employee4.setDateOfJoining(LocalDateTime.now().minusMonths(12));
        employee4.setAddress("987 Marketing Way, City, State 12345");
        employee4.setEmergencyContact("+1987654326");
        userRepository.save(employee4);
        
        // Initialize Performance Goals
        initializePerformanceGoals(admin, manager, employee1, employee2, employee3, employee4);
        
        // Initialize Appraisals
        initializeAppraisals(admin, manager, employee1, employee2, employee3, employee4);
        
        // Initialize Feedback
        initializeFeedback(admin, manager, employee1, employee2, employee3, employee4);
        
        // Initialize AI Suggestions
        initializeAISuggestions(admin, manager, employee1, employee2, employee3, employee4);
    }
    
    private void initializePerformanceData() {
        // Get existing users
        User admin = userRepository.findByEmail("admin@hrm.com").orElse(null);
        User manager = userRepository.findByEmail("manager@hrm.com").orElse(null);
        User employee1 = userRepository.findByEmail("employee@hrm.com").orElse(null);
        User employee2 = userRepository.findByEmail("support@hrm.com").orElse(null);
        User employee3 = userRepository.findByEmail("sarah@hrm.com").orElse(null);
        User employee4 = userRepository.findByEmail("david@hrm.com").orElse(null);
        
        if (admin != null && manager != null && employee1 != null && employee2 != null && employee3 != null && employee4 != null) {
            // Clear existing performance data
            performanceGoalRepository.deleteAll();
            appraisalRepository.deleteAll();
            feedbackRepository.deleteAll();
            aiSuggestionRepository.deleteAll();
            
            // Initialize Performance Goals
            initializePerformanceGoals(admin, manager, employee1, employee2, employee3, employee4);
            
            // Initialize Appraisals
            initializeAppraisals(admin, manager, employee1, employee2, employee3, employee4);
            
            // Initialize Feedback
            initializeFeedback(admin, manager, employee1, employee2, employee3, employee4);
            
            // Initialize AI Suggestions
            initializeAISuggestions(admin, manager, employee1, employee2, employee3, employee4);
        }
    }
    
    private void initializePerformanceGoals(User admin, User manager, User employee1, User employee2, User employee3, User employee4) {
        // Goals for Employee 1
        PerformanceGoal goal1 = new PerformanceGoal();
        goal1.setUser(employee1);
        goal1.setTitle("Improve Code Quality");
        goal1.setDescription("Reduce code review comments by 50% and increase test coverage to 80%");
        goal1.setStatus(PerformanceGoal.GoalStatus.ON_TRACK);
        goal1.setProgress(75);
        goal1.setTarget("100");
        goal1.setCurrent("75");
        goal1.setDueDate(LocalDateTime.now().plusMonths(2));
        goal1.setType(PerformanceGoal.GoalType.SKILL_DEVELOPMENT);
        goal1.setAssignedBy(manager);
        performanceGoalRepository.save(goal1);
        
        PerformanceGoal goal2 = new PerformanceGoal();
        goal2.setUser(employee1);
        goal2.setTitle("Learn React Framework");
        goal2.setDescription("Complete React certification and contribute to frontend projects");
        goal2.setStatus(PerformanceGoal.GoalStatus.AT_RISK);
        goal2.setProgress(40);
        goal2.setTarget("100");
        goal2.setCurrent("40");
        goal2.setDueDate(LocalDateTime.now().plusMonths(3));
        goal2.setType(PerformanceGoal.GoalType.SKILL_DEVELOPMENT);
        goal2.setAssignedBy(manager);
        performanceGoalRepository.save(goal2);
        
        // Goals for Employee 2
        PerformanceGoal goal3 = new PerformanceGoal();
        goal3.setUser(employee2);
        goal3.setTitle("Resolve Support Tickets");
        goal3.setDescription("Maintain average resolution time under 4 hours for priority tickets");
        goal3.setStatus(PerformanceGoal.GoalStatus.COMPLETED);
        goal3.setProgress(100);
        goal3.setTarget("100");
        goal3.setCurrent("100");
        goal3.setDueDate(LocalDateTime.now().minusDays(5));
        goal3.setType(PerformanceGoal.GoalType.PROJECT_BASED);
        goal3.setAssignedBy(manager);
        performanceGoalRepository.save(goal3);
        
        // Goals for Employee 3
        PerformanceGoal goal4 = new PerformanceGoal();
        goal4.setUser(employee3);
        goal4.setTitle("Financial Reporting");
        goal4.setDescription("Automate monthly financial reports and reduce processing time by 30%");
        goal4.setStatus(PerformanceGoal.GoalStatus.ON_TRACK);
        goal4.setProgress(60);
        goal4.setTarget("100");
        goal4.setCurrent("60");
        goal4.setDueDate(LocalDateTime.now().plusMonths(1));
        goal4.setType(PerformanceGoal.GoalType.PROJECT_BASED);
        goal4.setAssignedBy(admin);
        performanceGoalRepository.save(goal4);
    }
    
    private void initializeAppraisals(User admin, User manager, User employee1, User employee2, User employee3, User employee4) {
        // Appraisal for Employee 1
        Appraisal appraisal1 = new Appraisal();
        appraisal1.setEmployee(employee1);
        appraisal1.setManager(manager);
        appraisal1.setPeriod("Q4 2024");
        appraisal1.setRating(4.2);
        appraisal1.setAchievements("Successfully completed 3 major projects, improved code quality metrics");
        appraisal1.setImprovements("Need to improve time management and communication skills");
        appraisal1.setGoals("Focus on React development and team collaboration");
        appraisal1.setStatus(Appraisal.AppraisalStatus.COMPLETED);
        appraisal1.setAppraisalDate(LocalDateTime.now().minusDays(30));
        appraisal1.setEmployeeComments("I'm satisfied with my performance and excited about the new goals");
        appraisal1.setManagerComments("Excellent technical skills, good potential for growth");
        appraisalRepository.save(appraisal1);
        
        // Appraisal for Employee 2
        Appraisal appraisal2 = new Appraisal();
        appraisal2.setEmployee(employee2);
        appraisal2.setManager(manager);
        appraisal2.setPeriod("Q4 2024");
        appraisal2.setRating(3.8);
        appraisal2.setAchievements("Maintained excellent customer satisfaction scores");
        appraisal2.setImprovements("Could improve technical documentation");
        appraisal2.setGoals("Enhance technical skills and take on more complex issues");
        appraisal2.setStatus(Appraisal.AppraisalStatus.COMPLETED);
        appraisal2.setAppraisalDate(LocalDateTime.now().minusDays(25));
        appraisal2.setEmployeeComments("I'm working on improving my technical documentation");
        appraisal2.setManagerComments("Great customer service skills, needs technical development");
        appraisalRepository.save(appraisal2);
        
        // Appraisal for Employee 3
        Appraisal appraisal3 = new Appraisal();
        appraisal3.setEmployee(employee3);
        appraisal3.setManager(admin);
        appraisal3.setPeriod("Q4 2024");
        appraisal3.setRating(4.5);
        appraisal3.setAchievements("Successfully automated financial processes, saved 20 hours per month");
        appraisal3.setImprovements("Could mentor junior team members more");
        appraisal3.setGoals("Lead automation initiatives and mentor team members");
        appraisal3.setStatus(Appraisal.AppraisalStatus.COMPLETED);
        appraisal3.setAppraisalDate(LocalDateTime.now().minusDays(20));
        appraisal3.setEmployeeComments("I'm ready to take on more leadership responsibilities");
        appraisal3.setManagerComments("Outstanding performance, ready for promotion");
        appraisalRepository.save(appraisal3);
    }
    
    private void initializeFeedback(User admin, User manager, User employee1, User employee2, User employee3, User employee4) {
        // Peer Feedback for Employee 1
        Feedback feedback1 = new Feedback();
        feedback1.setRecipient(employee1);
        feedback1.setReviewer(employee2);
        feedback1.setType(Feedback.FeedbackType.PEER);
        feedback1.setRating(4);
        feedback1.setComment("Great team player, always willing to help with technical issues");
        feedback1.setStatus(Feedback.FeedbackStatus.SUBMITTED);
        feedback1.setReviewPeriod("Q4 2024");
        feedbackRepository.save(feedback1);
        
        // Manager Feedback for Employee 1
        Feedback feedback2 = new Feedback();
        feedback2.setRecipient(employee1);
        feedback2.setReviewer(manager);
        feedback2.setType(Feedback.FeedbackType.MANAGER);
        feedback2.setRating(4);
        feedback2.setComment("Strong technical skills, good project delivery");
        feedback2.setStatus(Feedback.FeedbackStatus.SUBMITTED);
        feedback2.setReviewPeriod("Q4 2024");
        feedbackRepository.save(feedback2);
        
        // Self Assessment for Employee 1
        Feedback feedback3 = new Feedback();
        feedback3.setRecipient(employee1);
        feedback3.setReviewer(employee1);
        feedback3.setType(Feedback.FeedbackType.SELF);
        feedback3.setRating(4);
        feedback3.setComment("I'm satisfied with my technical contributions but need to improve communication");
        feedback3.setStatus(Feedback.FeedbackStatus.SUBMITTED);
        feedback3.setReviewPeriod("Q4 2024");
        feedbackRepository.save(feedback3);
        
        // Peer Feedback for Employee 2
        Feedback feedback4 = new Feedback();
        feedback4.setRecipient(employee2);
        feedback4.setReviewer(employee1);
        feedback4.setType(Feedback.FeedbackType.PEER);
        feedback4.setRating(5);
        feedback4.setComment("Excellent customer service skills, very patient and helpful");
        feedback4.setStatus(Feedback.FeedbackStatus.SUBMITTED);
        feedback4.setReviewPeriod("Q4 2024");
        feedbackRepository.save(feedback4);
    }
    
    private void initializeAISuggestions(User admin, User manager, User employee1, User employee2, User employee3, User employee4) {
        // AI Suggestions for Employee 1
        AISuggestion suggestion1 = new AISuggestion();
        suggestion1.setUser(employee1);
        suggestion1.setTitle("Improve Time Management");
        suggestion1.setDescription("Based on your work patterns, consider using time-blocking techniques to improve productivity");
        suggestion1.setCategory(AISuggestion.SuggestionCategory.PRODUCTIVITY);
        suggestion1.setPriority(AISuggestion.SuggestionPriority.HIGH);
        suggestion1.setType(AISuggestion.SuggestionType.IMPROVEMENT);
        suggestion1.setStatus(AISuggestion.SuggestionStatus.ACTIVE);
        suggestion1.setAiScore(0.85);
        aiSuggestionRepository.save(suggestion1);
        
        AISuggestion suggestion2 = new AISuggestion();
        suggestion2.setUser(employee1);
        suggestion2.setTitle("Learn Advanced React Patterns");
        suggestion2.setDescription("Your React skills are good, but learning advanced patterns could help with complex projects");
        suggestion2.setCategory(AISuggestion.SuggestionCategory.SKILLS);
        suggestion2.setPriority(AISuggestion.SuggestionPriority.MEDIUM);
        suggestion2.setType(AISuggestion.SuggestionType.OPPORTUNITY);
        suggestion2.setStatus(AISuggestion.SuggestionStatus.ACTIVE);
        suggestion2.setAiScore(0.78);
        aiSuggestionRepository.save(suggestion2);
        
        // AI Suggestions for Employee 2
        AISuggestion suggestion3 = new AISuggestion();
        suggestion3.setUser(employee2);
        suggestion3.setTitle("Enhance Technical Documentation");
        suggestion3.setDescription("Improving documentation skills could help with knowledge sharing and career growth");
        suggestion3.setCategory(AISuggestion.SuggestionCategory.SKILLS);
        suggestion3.setPriority(AISuggestion.SuggestionPriority.MEDIUM);
        suggestion3.setType(AISuggestion.SuggestionType.IMPROVEMENT);
        suggestion3.setStatus(AISuggestion.SuggestionStatus.ACTIVE);
        suggestion3.setAiScore(0.72);
        aiSuggestionRepository.save(suggestion3);
        
        // AI Suggestions for Employee 3
        AISuggestion suggestion4 = new AISuggestion();
        suggestion4.setUser(employee3);
        suggestion4.setTitle("Mentor Junior Team Members");
        suggestion4.setDescription("Your expertise could be valuable in mentoring junior team members");
        suggestion4.setCategory(AISuggestion.SuggestionCategory.LEADERSHIP);
        suggestion4.setPriority(AISuggestion.SuggestionPriority.HIGH);
        suggestion4.setType(AISuggestion.SuggestionType.OPPORTUNITY);
        suggestion4.setStatus(AISuggestion.SuggestionStatus.ACTIVE);
        suggestion4.setAiScore(0.91);
        aiSuggestionRepository.save(suggestion4);
        
        // Implemented suggestion for Employee 1
        AISuggestion suggestion5 = new AISuggestion();
        suggestion5.setUser(employee1);
        suggestion5.setTitle("Improve Code Review Process");
        suggestion5.setDescription("Implement automated code quality checks to reduce review time");
        suggestion5.setCategory(AISuggestion.SuggestionCategory.PRODUCTIVITY);
        suggestion5.setPriority(AISuggestion.SuggestionPriority.HIGH);
        suggestion5.setType(AISuggestion.SuggestionType.IMPROVEMENT);
        suggestion5.setStatus(AISuggestion.SuggestionStatus.IMPLEMENTED);
        suggestion5.setAiScore(0.88);
        suggestion5.setImplementedAt(LocalDateTime.now().minusDays(5));
        suggestion5.setImplementationNotes("Implemented automated linting and code quality checks");
        aiSuggestionRepository.save(suggestion5);
    }
} 
package com.hrm.system.config;

import com.hrm.system.entity.User;
import com.hrm.system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Data initializer to populate the database with sample data
 */
@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Only initialize if no users exist
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
    }
} 
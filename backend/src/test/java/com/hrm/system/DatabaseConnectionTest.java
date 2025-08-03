package com.hrm.system;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import com.hrm.system.repository.UserRepository;
import com.hrm.system.entity.User;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Test class to verify SQLite database connection and basic operations
 */
@SpringBootTest
@DataJpaTest
@ActiveProfiles("test")
public class DatabaseConnectionTest {
    
    @Autowired
    private UserRepository userRepository;
    
    @Test
    public void testDatabaseConnection() {
        // Test that the repository is properly injected
        assertNotNull(userRepository, "UserRepository should not be null");
    }
    
    @Test
    public void testCreateAndFindUser() {
        // Create a test user
        User user = new User();
        user.setEmployeeId("EMP001");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setEmail("john.doe@test.com");
        user.setPassword("password123");
        user.setPhoneNumber("1234567890");
        user.setRole(User.UserRole.EMPLOYEE);
        user.setDepartment(User.Department.IT);
        user.setStatus(User.UserStatus.ACTIVE);
        
        // Save the user
        User savedUser = userRepository.save(user);
        
        // Verify the user was saved
        assertNotNull(savedUser.getId(), "User ID should not be null after saving");
        assertEquals("EMP001", savedUser.getEmployeeId(), "Employee ID should match");
        assertEquals("John", savedUser.getFirstName(), "First name should match");
        assertEquals("Doe", savedUser.getLastName(), "Last name should match");
        
        // Find the user by ID
        User foundUser = userRepository.findById(savedUser.getId()).orElse(null);
        assertNotNull(foundUser, "User should be found by ID");
        assertEquals("john.doe@test.com", foundUser.getEmail(), "Email should match");
        
        // Find the user by email
        User userByEmail = userRepository.findByEmail("john.doe@test.com").orElse(null);
        assertNotNull(userByEmail, "User should be found by email");
        assertEquals("EMP001", userByEmail.getEmployeeId(), "Employee ID should match");
        
        // Find the user by employee ID
        User userByEmployeeId = userRepository.findByEmployeeId("EMP001").orElse(null);
        assertNotNull(userByEmployeeId, "User should be found by employee ID");
        assertEquals("john.doe@test.com", userByEmployeeId.getEmail(), "Email should match");
    }
    
    @Test
    public void testUserCount() {
        // Get initial count
        long initialCount = userRepository.count();
        
        // Create a test user
        User user = new User();
        user.setEmployeeId("EMP002");
        user.setFirstName("Jane");
        user.setLastName("Smith");
        user.setEmail("jane.smith@test.com");
        user.setPassword("password123");
        user.setPhoneNumber("0987654321");
        user.setRole(User.UserRole.MANAGER);
        user.setDepartment(User.Department.HR);
        user.setStatus(User.UserStatus.ACTIVE);
        
        // Save the user
        userRepository.save(user);
        
        // Verify count increased
        long newCount = userRepository.count();
        assertEquals(initialCount + 1, newCount, "User count should increase by 1");
    }
    
    @Test
    public void testFindByRole() {
        // Create a test user with ADMIN role
        User adminUser = new User();
        adminUser.setEmployeeId("EMP003");
        adminUser.setFirstName("Admin");
        adminUser.setLastName("User");
        adminUser.setEmail("admin@test.com");
        adminUser.setPassword("password123");
        adminUser.setPhoneNumber("5555555555");
        adminUser.setRole(User.UserRole.ADMIN);
        adminUser.setDepartment(User.Department.HR);
        adminUser.setStatus(User.UserStatus.ACTIVE);
        
        userRepository.save(adminUser);
        
        // Find users by role
        var adminUsers = userRepository.findByRole(User.UserRole.ADMIN);
        assertFalse(adminUsers.isEmpty(), "Should find at least one admin user");
        
        // Verify the found user is an admin
        boolean foundAdmin = adminUsers.stream()
                .anyMatch(user -> "admin@test.com".equals(user.getEmail()));
        assertTrue(foundAdmin, "Should find the admin user by email");
    }
    
    @Test
    public void testFindByDepartment() {
        // Create a test user with IT department
        User itUser = new User();
        itUser.setEmployeeId("EMP004");
        itUser.setFirstName("IT");
        itUser.setLastName("User");
        itUser.setEmail("it.user@test.com");
        itUser.setPassword("password123");
        itUser.setPhoneNumber("4444444444");
        itUser.setRole(User.UserRole.EMPLOYEE);
        itUser.setDepartment(User.Department.IT);
        itUser.setStatus(User.UserStatus.ACTIVE);
        
        userRepository.save(itUser);
        
        // Find users by department
        var itUsers = userRepository.findByDepartment(User.Department.IT);
        assertFalse(itUsers.isEmpty(), "Should find at least one IT user");
        
        // Verify the found user is in IT department
        boolean foundItUser = itUsers.stream()
                .anyMatch(user -> "it.user@test.com".equals(user.getEmail()));
        assertTrue(foundItUser, "Should find the IT user by email");
    }
} 
package com.hrm.system.service.impl;

import com.hrm.system.dto.UserDto;
import com.hrm.system.entity.User;
import com.hrm.system.repository.UserRepository;
import com.hrm.system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public UserDto createUser(UserDto userDto) {
        return createUserInternal(userDto);
    }
    
    private UserDto createUserInternal(UserDto userDto) {
        try {
            // Validate input
            if (userDto == null) {
                throw new RuntimeException("User data cannot be null");
            }
            
            if (userDto.getEmail() == null || userDto.getEmail().trim().isEmpty()) {
                throw new RuntimeException("Email is required");
            }
            
            if (userDto.getFirstName() == null || userDto.getFirstName().trim().isEmpty()) {
                throw new RuntimeException("First name is required");
            }
            
            if (userDto.getLastName() == null || userDto.getLastName().trim().isEmpty()) {
                throw new RuntimeException("Last name is required");
            }
            
            if (userDto.getPhoneNumber() == null || userDto.getPhoneNumber().trim().isEmpty()) {
                throw new RuntimeException("Phone number is required");
            }
            
            if (userDto.getRole() == null) {
                throw new RuntimeException("Role is required");
            }
            
            if (userDto.getDepartment() == null) {
                throw new RuntimeException("Department is required");
            }
            
            // Check if user already exists
            if (existsByEmail(userDto.getEmail())) {
                throw new RuntimeException("User with email " + userDto.getEmail() + " already exists");
            }
            
            // Generate dynamic employee ID if not provided or if it already exists
            String employeeId = userDto.getEmployeeId();
            if (employeeId == null || employeeId.trim().isEmpty() || existsByEmployeeId(employeeId)) {
                employeeId = generateEmployeeId();
            }
            
            User user = new User();
            user.setEmployeeId(employeeId);
            user.setFirstName(userDto.getFirstName().trim());
            user.setLastName(userDto.getLastName().trim());
            user.setEmail(userDto.getEmail().trim().toLowerCase());
            user.setPassword(passwordEncoder.encode("password123")); // Default password
            user.setPhoneNumber(userDto.getPhoneNumber().trim());
            user.setRole(userDto.getRole());
            user.setDepartment(userDto.getDepartment());
            user.setStatus(User.UserStatus.ACTIVE);
            user.setProfileImage(userDto.getProfileImage());
            user.setDateOfBirth(userDto.getDateOfBirth());
            user.setDateOfJoining(userDto.getDateOfJoining() != null ? userDto.getDateOfJoining() : LocalDateTime.now());
            user.setAddress(userDto.getAddress() != null ? userDto.getAddress().trim() : null);
            user.setEmergencyContact(userDto.getEmergencyContact() != null ? userDto.getEmergencyContact().trim() : null);
            
            // Set manager if provided
            if (userDto.getManagerId() != null) {
                Optional<User> manager = userRepository.findById(userDto.getManagerId());
                if (manager.isPresent()) {
                    user.setManager(manager.get());
                } else {
                    throw new RuntimeException("Manager with ID " + userDto.getManagerId() + " not found");
                }
            }
            
            User savedUser = userRepository.save(user);
            return new UserDto(savedUser);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create user: " + e.getMessage(), e);
        }
    }
    
    /**
     * Generate a unique employee ID
     */
    private String generateEmployeeId() {
        String prefix = "EMP";
        int counter = 1;
        String employeeId;
        
        do {
            String paddedNumber = String.format("%03d", counter);
            employeeId = prefix + paddedNumber;
            counter++;
        } while (existsByEmployeeId(employeeId));
        
        return employeeId;
    }
    
    @Override
    public UserDto updateUser(Long id, UserDto userDto) {
        Optional<User> existingUser = userRepository.findById(id);
        if (existingUser.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + id);
        }
        
        User user = existingUser.get();
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setPhoneNumber(userDto.getPhoneNumber());
        user.setRole(userDto.getRole());
        user.setDepartment(userDto.getDepartment());
        user.setProfileImage(userDto.getProfileImage());
        user.setDateOfBirth(userDto.getDateOfBirth());
        user.setDateOfJoining(userDto.getDateOfJoining());
        user.setAddress(userDto.getAddress());
        user.setEmergencyContact(userDto.getEmergencyContact());
        
        // Update manager if provided
        if (userDto.getManagerId() != null) {
            Optional<User> manager = userRepository.findById(userDto.getManagerId());
            if (manager.isPresent()) {
                user.setManager(manager.get());
            }
        } else {
            user.setManager(null);
        }
        
        User updatedUser = userRepository.save(user);
        return new UserDto(updatedUser);
    }
    
    @Override
    public Optional<UserDto> getUserById(Long id) {
        return userRepository.findById(id).map(UserDto::new);
    }
    
    @Override
    public Optional<UserDto> getUserByEmail(String email) {
        return userRepository.findByEmail(email).map(UserDto::new);
    }
    
    @Override
    public Optional<UserDto> getUserByEmployeeId(String employeeId) {
        return userRepository.findByEmployeeId(employeeId).map(UserDto::new);
    }
    
    @Override
    public Page<UserDto> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(UserDto::new);
    }
    
    @Override
    public List<UserDto> getUsersByDepartment(User.Department department) {
        return userRepository.findByDepartment(department)
                .stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<UserDto> getUsersByRole(User.UserRole role) {
        return userRepository.findByRole(role)
                .stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<UserDto> getUsersByStatus(User.UserStatus status) {
        return userRepository.findByStatus(status)
                .stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<UserDto> getTeamMembers(Long managerId) {
        return userRepository.findByManagerId(managerId)
                .stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<UserDto> searchUsers(String query) {
        return userRepository.searchUsers(query)
                .stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with ID: " + id);
        }
        userRepository.deleteById(id);
    }
    
    @Override
    public UserDto updateUserStatus(Long id, User.UserStatus status) {
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + id);
        }
        
        User existingUser = user.get();
        existingUser.setStatus(status);
        User updatedUser = userRepository.save(existingUser);
        return new UserDto(updatedUser);
    }
    
    @Override
    public UserDto updateProfileImage(Long id, String imageUrl) {
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + id);
        }
        
        User existingUser = user.get();
        existingUser.setProfileImage(imageUrl);
        User updatedUser = userRepository.save(existingUser);
        return new UserDto(updatedUser);
    }
    
    @Override
    public UserStatistics getUserStatistics() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByStatus(User.UserStatus.ACTIVE);
        long newHiresThisMonth = userRepository.countNewHiresThisMonth();
        long pendingApprovals = 0; // This would come from leave/attendance service
        
        return new UserStatistics(totalUsers, activeUsers, newHiresThisMonth, pendingApprovals);
    }
    
    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    @Override
    public boolean existsByEmployeeId(String employeeId) {
        return userRepository.existsByEmployeeId(employeeId);
    }
    
    @Override
    public void updateLastLogin(Long userId) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);
        });
    }
    
    @Override
    public long getActiveUsersCount() {
        return userRepository.countByStatus(User.UserStatus.ACTIVE);
    }
    
    @Override
    public long getUsersCountByDepartment(User.Department department) {
        return userRepository.countByDepartment(department);
    }
    
    @Override
    public long getUsersCountByRole(User.UserRole role) {
        return userRepository.countByRole(role);
    }
} 
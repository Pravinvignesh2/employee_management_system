package com.hrm.system.service.impl;

import com.hrm.system.dto.AttendanceDto;
import com.hrm.system.entity.Attendance;
import com.hrm.system.entity.User;
import com.hrm.system.repository.AttendanceRepository;
import com.hrm.system.repository.UserRepository;
import com.hrm.system.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class AttendanceServiceImpl implements AttendanceService {
    
    @Autowired
    private AttendanceRepository attendanceRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public AttendanceDto punchIn(Long userId, String location, Double latitude, Double longitude) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        
        LocalDate today = LocalDate.now();
        LocalTime currentTime = LocalTime.now();
        
        // Check if already punched in today
        if (hasPunchedIn(userId, today)) {
            throw new RuntimeException("User has already punched in today");
        }
        
        // Create new attendance record
        Attendance attendance = new Attendance();
        attendance.setUser(user);
        attendance.setDate(today);
        attendance.setPunchInTime(currentTime);
        attendance.setPunchInLocation(location);
        attendance.setPunchInLatitude(latitude);
        attendance.setPunchInLongitude(longitude);
        
        // Determine status based on punch in time
        LocalTime standardStartTime = LocalTime.of(9, 0); // 9:00 AM
        if (currentTime.isAfter(standardStartTime)) {
            attendance.setStatus(Attendance.AttendanceStatus.HALF_DAY);
        } else {
            attendance.setStatus(Attendance.AttendanceStatus.PRESENT);
        }
        
        Attendance savedAttendance = attendanceRepository.save(attendance);
        return new AttendanceDto(savedAttendance);
    }
    
    @Override
    public AttendanceDto punchOut(Long userId, String location, Double latitude, Double longitude) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        
        LocalDate today = LocalDate.now();
        LocalTime currentTime = LocalTime.now();
        
        // Find today's attendance record
        Optional<Attendance> attendanceOpt = attendanceRepository.findByUserAndDate(user, today);
        if (attendanceOpt.isEmpty()) {
            throw new RuntimeException("No punch-in record found for today");
        }
        
        Attendance attendance = attendanceOpt.get();
        
        // Check if already punched out
        if (hasPunchedOut(userId, today)) {
            throw new RuntimeException("User has already punched out today");
        }
        
        // Update punch out information
        attendance.setPunchOutTime(currentTime);
        attendance.setPunchOutLocation(location);
        attendance.setPunchOutLatitude(latitude);
        attendance.setPunchOutLongitude(longitude);
        
        // Update status if needed
        if (attendance.getStatus() == Attendance.AttendanceStatus.HALF_DAY) {
            // Check if working hours are sufficient
            long workingHours = attendance.getWorkingHours();
            if (workingHours < 6) { // Less than 6 hours
                attendance.setStatus(Attendance.AttendanceStatus.HALF_DAY);
            }
        }
        
        Attendance updatedAttendance = attendanceRepository.save(attendance);
        return new AttendanceDto(updatedAttendance);
    }
    
    @Override
    public AttendanceDto createAttendance(AttendanceDto attendanceDto) {
        User user = userRepository.findById(attendanceDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + attendanceDto.getUserId()));
        
        // Check if attendance already exists for the date
        if (attendanceRepository.existsByUserIdAndDate(attendanceDto.getUserId(), attendanceDto.getDate())) {
            throw new RuntimeException("Attendance record already exists for this date");
        }
        
        Attendance attendance = new Attendance();
        attendance.setUser(user);
        attendance.setDate(attendanceDto.getDate());
        attendance.setPunchInTime(attendanceDto.getPunchInTime());
        attendance.setPunchOutTime(attendanceDto.getPunchOutTime());
        attendance.setPunchInLocation(attendanceDto.getPunchInLocation());
        attendance.setPunchOutLocation(attendanceDto.getPunchOutLocation());
        attendance.setStatus(attendanceDto.getStatus());
        attendance.setNotes(attendanceDto.getNotes());
        
        Attendance savedAttendance = attendanceRepository.save(attendance);
        return new AttendanceDto(savedAttendance);
    }
    
    @Override
    public AttendanceDto updateAttendance(Long id, AttendanceDto attendanceDto) {
        Optional<Attendance> attendanceOpt = attendanceRepository.findById(id);
        if (attendanceOpt.isEmpty()) {
            throw new RuntimeException("Attendance record not found with ID: " + id);
        }
        
        Attendance attendance = attendanceOpt.get();
        attendance.setPunchInTime(attendanceDto.getPunchInTime());
        attendance.setPunchOutTime(attendanceDto.getPunchOutTime());
        attendance.setPunchInLocation(attendanceDto.getPunchInLocation());
        attendance.setPunchOutLocation(attendanceDto.getPunchOutLocation());
        attendance.setStatus(attendanceDto.getStatus());
        attendance.setNotes(attendanceDto.getNotes());
        
        Attendance updatedAttendance = attendanceRepository.save(attendance);
        return new AttendanceDto(updatedAttendance);
    }
    
    @Override
    public Optional<AttendanceDto> getAttendanceById(Long id) {
        return attendanceRepository.findById(id).map(AttendanceDto::new);
    }
    
    @Override
    public Optional<AttendanceDto> getAttendanceByUserAndDate(Long userId, LocalDate date) {
        return attendanceRepository.findByUserIdAndDate(userId, date).map(AttendanceDto::new);
    }
    
    @Override
    public Page<AttendanceDto> getAllAttendance(Pageable pageable) {
        return attendanceRepository.findAll(pageable).map(AttendanceDto::new);
    }
    
    @Override
    public List<AttendanceDto> getAttendanceByUser(Long userId) {
        return attendanceRepository.findByUserIdOrderByDateDesc(userId)
                .stream()
                .map(AttendanceDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<AttendanceDto> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByDateOrderByUserFirstNameAsc(date)
                .stream()
                .map(AttendanceDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<AttendanceDto> getAttendanceByUserAndDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.findByUserIdAndDateBetween(userId, startDate, endDate)
                .stream()
                .map(AttendanceDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<AttendanceDto> getAttendanceByDepartmentAndDate(String department, LocalDate date) {
        User.Department dept = User.Department.valueOf(department.toUpperCase());
        return attendanceRepository.findByDepartmentAndDate(dept, date)
                .stream()
                .map(AttendanceDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<AttendanceDto> getAttendanceByStatus(Attendance.AttendanceStatus status) {
        return attendanceRepository.findByStatusOrderByDateDesc(status)
                .stream()
                .map(AttendanceDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public AttendanceStatistics getAttendanceStatistics() {
        LocalDate today = LocalDate.now();
        
        long totalPresent = attendanceRepository.countByDateAndStatus(today, Attendance.AttendanceStatus.PRESENT);
        long totalAbsent = attendanceRepository.countByDateAndStatus(today, Attendance.AttendanceStatus.ABSENT);
        long totalHalfDay = attendanceRepository.countByDateAndStatus(today, Attendance.AttendanceStatus.HALF_DAY);
        long totalLeave = attendanceRepository.countByDateAndStatus(today, Attendance.AttendanceStatus.LEAVE);
        
        long totalEmployees = totalPresent + totalAbsent + totalHalfDay + totalLeave;
        double attendanceRate = totalEmployees > 0 ? (double) totalPresent / totalEmployees * 100 : 0;
        
        return new AttendanceStatistics(totalPresent, totalAbsent, totalHalfDay, totalLeave, attendanceRate);
    }
    
    @Override
    public UserAttendanceStatistics getUserAttendanceStatistics(Long userId) {
        LocalDate startDate = LocalDate.now().minusDays(30); // Last 30 days
        LocalDate endDate = LocalDate.now();
        
        long totalDays = attendanceRepository.countByUserIdAndDateBetween(userId, startDate, endDate);
        long presentDays = attendanceRepository.countByUserIdAndDateBetweenAndStatus(userId, startDate, endDate, Attendance.AttendanceStatus.PRESENT);
        long absentDays = attendanceRepository.countByUserIdAndDateBetweenAndStatus(userId, startDate, endDate, Attendance.AttendanceStatus.ABSENT);
        long halfDays = attendanceRepository.countByUserIdAndDateBetweenAndStatus(userId, startDate, endDate, Attendance.AttendanceStatus.HALF_DAY);
        long leaveDays = attendanceRepository.countByUserIdAndDateBetweenAndStatus(userId, startDate, endDate, Attendance.AttendanceStatus.LEAVE);
        
        double attendanceRate = totalDays > 0 ? (double) presentDays / totalDays * 100 : 0;
        
        // Calculate total working hours
        long totalWorkingHours = getTotalWorkingHours(userId, startDate, endDate);
        
        return new UserAttendanceStatistics(totalDays, presentDays, absentDays, halfDays, leaveDays, attendanceRate, totalWorkingHours);
    }
    
    @Override
    public DepartmentAttendanceStatistics getDepartmentAttendanceStatistics(String department) {
        LocalDate today = LocalDate.now();
        User.Department dept = User.Department.valueOf(department.toUpperCase());
        
        long totalEmployees = attendanceRepository.countByDepartmentAndDate(dept, today);
        long presentEmployees = attendanceRepository.countByDepartmentAndDateAndStatus(dept, today, Attendance.AttendanceStatus.PRESENT);
        long absentEmployees = attendanceRepository.countByDepartmentAndDateAndStatus(dept, today, Attendance.AttendanceStatus.ABSENT);
        
        double attendanceRate = totalEmployees > 0 ? (double) presentEmployees / totalEmployees * 100 : 0;
        
        return new DepartmentAttendanceStatistics(department, totalEmployees, presentEmployees, absentEmployees, attendanceRate);
    }
    
    @Override
    public AttendanceDto markAbsent(Long userId, LocalDate date, String reason) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        
        // Check if attendance already exists
        Optional<Attendance> existingAttendance = attendanceRepository.findByUserAndDate(user, date);
        if (existingAttendance.isPresent()) {
            throw new RuntimeException("Attendance record already exists for this date");
        }
        
        Attendance attendance = new Attendance();
        attendance.setUser(user);
        attendance.setDate(date);
        attendance.setStatus(Attendance.AttendanceStatus.ABSENT);
        attendance.setNotes(reason);
        
        Attendance savedAttendance = attendanceRepository.save(attendance);
        return new AttendanceDto(savedAttendance);
    }
    
    @Override
    public AttendanceDto markHalfDay(Long userId, LocalDate date, String reason) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        
        // Check if attendance already exists
        Optional<Attendance> existingAttendance = attendanceRepository.findByUserAndDate(user, date);
        if (existingAttendance.isPresent()) {
            throw new RuntimeException("Attendance record already exists for this date");
        }
        
        Attendance attendance = new Attendance();
        attendance.setUser(user);
        attendance.setDate(date);
        attendance.setStatus(Attendance.AttendanceStatus.HALF_DAY);
        attendance.setNotes(reason);
        
        Attendance savedAttendance = attendanceRepository.save(attendance);
        return new AttendanceDto(savedAttendance);
    }
    
    @Override
    public void deleteAttendance(Long id) {
        if (!attendanceRepository.existsById(id)) {
            throw new RuntimeException("Attendance record not found with ID: " + id);
        }
        attendanceRepository.deleteById(id);
    }
    
    @Override
    public boolean hasPunchedIn(Long userId, LocalDate date) {
        return attendanceRepository.existsByUserIdAndDate(userId, date);
    }
    
    @Override
    public boolean hasPunchedOut(Long userId, LocalDate date) {
        Optional<Attendance> attendance = attendanceRepository.findByUserIdAndDate(userId, date);
        return attendance.isPresent() && attendance.get().getPunchOutTime() != null;
    }
    
    @Override
    public long getWorkingHours(Long userId, LocalDate date) {
        Optional<Attendance> attendance = attendanceRepository.findByUserIdAndDate(userId, date);
        if (attendance.isPresent()) {
            return attendance.get().getWorkingHours();
        }
        return 0;
    }
    
    @Override
    public long getTotalWorkingHours(Long userId, LocalDate startDate, LocalDate endDate) {
        List<Attendance> attendances = attendanceRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
        return attendances.stream()
                .mapToLong(Attendance::getWorkingHours)
                .sum();
    }
} 
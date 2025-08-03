package com.hrm.system.service.impl;

import com.hrm.system.dto.PerformanceDto;
import com.hrm.system.entity.Performance;
import com.hrm.system.entity.User;
import com.hrm.system.repository.PerformanceRepository;
import com.hrm.system.repository.UserRepository;
import com.hrm.system.service.PerformanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PerformanceServiceImpl implements PerformanceService {
    
    @Autowired
    private PerformanceRepository performanceRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public PerformanceDto createPerformance(PerformanceDto performanceDto) {
        // Validate user exists
        Optional<User> user = userRepository.findById(performanceDto.getUserId());
        if (user.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + performanceDto.getUserId());
        }
        
        Performance performance = new Performance();
        performance.setUser(user.get());
        performance.setReviewType(performanceDto.getReviewType());
        performance.setReviewPeriod(performanceDto.getReviewPeriod());
        performance.setGoals(performanceDto.getGoals());
        performance.setAchievements(performanceDto.getAchievements());
        performance.setStrengths(performanceDto.getStrengths());
        performance.setAreasOfImprovement(performanceDto.getAreasOfImprovement());
        performance.setChallenges(performanceDto.getChallenges());
        performance.setRecommendations(performanceDto.getRecommendations());
        performance.setStatus(Performance.PerformanceStatus.DRAFT);
        performance.setComments(performanceDto.getComments());
        
        Performance savedPerformance = performanceRepository.save(performance);
        return new PerformanceDto(savedPerformance);
    }
    
    @Override
    public Page<PerformanceDto> getAllPerformance(Pageable pageable) {
        return performanceRepository.findAll(pageable).map(PerformanceDto::new);
    }
    
    @Override
    public Optional<PerformanceDto> getPerformanceById(Long id) {
        return performanceRepository.findById(id).map(PerformanceDto::new);
    }
    
    @Override
    public PerformanceDto updatePerformance(Long id, PerformanceDto performanceDto) {
        Optional<Performance> existingPerformance = performanceRepository.findById(id);
        if (existingPerformance.isEmpty()) {
            throw new RuntimeException("Performance review not found with ID: " + id);
        }
        
        Performance performance = existingPerformance.get();
        performance.setReviewType(performanceDto.getReviewType());
        performance.setReviewPeriod(performanceDto.getReviewPeriod());
        performance.setGoals(performanceDto.getGoals());
        performance.setAchievements(performanceDto.getAchievements());
        performance.setStrengths(performanceDto.getStrengths());
        performance.setAreasOfImprovement(performanceDto.getAreasOfImprovement());
        performance.setChallenges(performanceDto.getChallenges());
        performance.setRecommendations(performanceDto.getRecommendations());
        performance.setComments(performanceDto.getComments());
        
        Performance updatedPerformance = performanceRepository.save(performance);
        return new PerformanceDto(updatedPerformance);
    }
    
    @Override
    public void deletePerformance(Long id) {
        if (!performanceRepository.existsById(id)) {
            throw new RuntimeException("Performance review not found with ID: " + id);
        }
        performanceRepository.deleteById(id);
    }
    
    @Override
    public List<PerformanceDto> getPerformanceByUser(Long userId) {
        return performanceRepository.findByUserIdOrderByReviewPeriodDesc(userId)
                .stream()
                .map(PerformanceDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<PerformanceDto> getPerformanceByStatus(Performance.PerformanceStatus status) {
        return performanceRepository.findByStatusOrderByReviewPeriodDesc(status)
                .stream()
                .map(PerformanceDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<PerformanceDto> getPerformanceByReviewType(Performance.ReviewType reviewType) {
        return performanceRepository.findByReviewTypeOrderByReviewPeriodDesc(reviewType)
                .stream()
                .map(PerformanceDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public PerformanceDto submitPerformance(Long id) {
        Optional<Performance> performance = performanceRepository.findById(id);
        if (performance.isEmpty()) {
            throw new RuntimeException("Performance review not found with ID: " + id);
        }
        
        Performance existingPerformance = performance.get();
        existingPerformance.setStatus(Performance.PerformanceStatus.IN_PROGRESS);
        existingPerformance.setReviewDate(LocalDateTime.now());
        
        Performance submittedPerformance = performanceRepository.save(existingPerformance);
        return new PerformanceDto(submittedPerformance);
    }
    
    @Override
    public PerformanceDto reviewPerformance(Long id, ReviewRequest reviewRequest) {
        Optional<Performance> performance = performanceRepository.findById(id);
        if (performance.isEmpty()) {
            throw new RuntimeException("Performance review not found with ID: " + id);
        }
        
        Performance existingPerformance = performance.get();
        existingPerformance.setOverallRating(reviewRequest.rating());
        existingPerformance.setComments(reviewRequest.comments());
        existingPerformance.setRecommendations(reviewRequest.recommendations());
        existingPerformance.setStatus(Performance.PerformanceStatus.COMPLETED);
        existingPerformance.setReviewDate(LocalDateTime.now());
        
        Performance reviewedPerformance = performanceRepository.save(existingPerformance);
        return new PerformanceDto(reviewedPerformance);
    }
    
    @Override
    public PerformanceDto approvePerformance(Long id) {
        Optional<Performance> performance = performanceRepository.findById(id);
        if (performance.isEmpty()) {
            throw new RuntimeException("Performance review not found with ID: " + id);
        }
        
        Performance existingPerformance = performance.get();
        existingPerformance.setStatus(Performance.PerformanceStatus.APPROVED);
        
        Performance approvedPerformance = performanceRepository.save(existingPerformance);
        return new PerformanceDto(approvedPerformance);
    }
    
    @Override
    public PerformanceDto rejectPerformance(Long id, String reason) {
        Optional<Performance> performance = performanceRepository.findById(id);
        if (performance.isEmpty()) {
            throw new RuntimeException("Performance review not found with ID: " + id);
        }
        
        Performance existingPerformance = performance.get();
        existingPerformance.setStatus(Performance.PerformanceStatus.REJECTED);
        existingPerformance.setComments(reason);
        
        Performance rejectedPerformance = performanceRepository.save(existingPerformance);
        return new PerformanceDto(rejectedPerformance);
    }
    
    @Override
    public PerformanceStatistics getPerformanceStatistics() {
        long totalReviews = performanceRepository.count();
        long completedReviews = performanceRepository.countByStatus(Performance.PerformanceStatus.COMPLETED);
        long pendingReviews = performanceRepository.countByStatus(Performance.PerformanceStatus.DRAFT);
        long underReviewReviews = performanceRepository.countByStatus(Performance.PerformanceStatus.IN_PROGRESS);
        
        // Calculate average rating
        Double averageRating = performanceRepository.findAll().stream()
                .filter(p -> p.getOverallRating() != null)
                .mapToInt(Performance::getOverallRating)
                .average()
                .orElse(0.0);
        
        // Count high performers (rating >= 4)
        long highPerformers = performanceRepository.findAll().stream()
                .filter(p -> p.getOverallRating() != null && p.getOverallRating() >= 4)
                .count();
        
        return new PerformanceStatistics(
            totalReviews,
            completedReviews,
            pendingReviews,
            underReviewReviews,
            averageRating,
            highPerformers
        );
    }
    
    @Override
    public UserPerformanceStatistics getUserPerformanceStatistics(Long userId) {
        long totalReviews = performanceRepository.countByUserId(userId);
        long completedReviews = performanceRepository.countByUserIdAndStatus(userId, Performance.PerformanceStatus.COMPLETED);
        long pendingReviews = performanceRepository.countByUserIdAndStatus(userId, Performance.PerformanceStatus.DRAFT);
        long underReviewReviews = performanceRepository.countByUserIdAndStatus(userId, Performance.PerformanceStatus.IN_PROGRESS);
        
        List<Performance> userReviews = performanceRepository.findByUserIdOrderByReviewPeriodDesc(userId);
        
        // Calculate average, highest, and lowest ratings
        Double averageRating = userReviews.stream()
                .filter(p -> p.getOverallRating() != null)
                .mapToInt(Performance::getOverallRating)
                .average()
                .orElse(0.0);
        
        Double highestRating = (double) userReviews.stream()
                .filter(p -> p.getOverallRating() != null)
                .mapToInt(Performance::getOverallRating)
                .max()
                .orElse(0);
        
        Double lowestRating = (double) userReviews.stream()
                .filter(p -> p.getOverallRating() != null)
                .mapToInt(Performance::getOverallRating)
                .min()
                .orElse(0);
        
        return new UserPerformanceStatistics(
            totalReviews,
            completedReviews,
            pendingReviews,
            underReviewReviews,
            averageRating,
            highestRating,
            lowestRating
        );
    }
    
    @Override
    public List<PerformanceDto> getHighPerformers(int limit) {
        return performanceRepository.findByOverallRatingGreaterThanEqualOrderByOverallRatingDesc(4)
                .stream()
                .limit(limit)
                .map(PerformanceDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<PerformanceDto> getPerformanceByDepartment(String department) {
        return performanceRepository.findByUserDepartmentOrderByReviewPeriodDesc(department)
                .stream()
                .map(PerformanceDto::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public long getCompletedReviewsCount() {
        return performanceRepository.countByStatus(Performance.PerformanceStatus.COMPLETED);
    }
    
    @Override
    public long getPendingReviewsCount() {
        return performanceRepository.countByStatus(Performance.PerformanceStatus.DRAFT);
    }
    
    @Override
    public long getUnderReviewCount() {
        return performanceRepository.countByStatus(Performance.PerformanceStatus.IN_PROGRESS);
    }
    
    @Override
    public boolean isOwner(Long performanceId, Long userId) {
        return performanceRepository.existsByIdAndUserId(performanceId, userId);
    }
} 
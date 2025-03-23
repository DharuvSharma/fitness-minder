
package com.fitness.application.service;

import com.fitness.application.dto.GoalDto;
import com.fitness.application.model.Goal;
import com.fitness.application.repository.GoalRepository;
import com.fitness.application.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoalService {
    private final GoalRepository goalRepository;
    
    public List<GoalDto> getAllGoals(UserDetailsImpl user) {
        return goalRepository.findByUserId(user.getId())
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public GoalDto getGoalById(String id, UserDetailsImpl user) {
        return goalRepository.findById(id)
                .filter(goal -> goal.getUserId().equals(user.getId()))
                .map(this::convertToDto)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
    }
    
    @Transactional
    public GoalDto createGoal(GoalDto goalDto, UserDetailsImpl user) {
        Goal goal = convertToEntity(goalDto);
        goal.setUserId(user.getId());
        
        if (goal.getCreatedAt() == null) {
            goal.setCreatedAt(LocalDate.now());
        }
        
        // Calculate progress
        int progress = calculateProgress(goal);
        goal.setProgress(progress);
        
        // Set status based on progress
        if (progress >= 100) {
            goal.setStatus("completed");
        } else if (progress > 0) {
            goal.setStatus("in-progress");
        } else {
            goal.setStatus("not-started");
        }
        
        Goal savedGoal = goalRepository.save(goal);
        return convertToDto(savedGoal);
    }
    
    @Transactional
    public GoalDto updateGoal(String id, GoalDto goalDto, UserDetailsImpl user) {
        // Verify goal exists and belongs to user
        Goal existingGoal = goalRepository.findById(id)
                .filter(g -> g.getUserId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Goal not found or unauthorized"));
        
        Goal goal = convertToEntity(goalDto);
        goal.setId(id);
        goal.setUserId(user.getId());
        goal.setCreatedAt(existingGoal.getCreatedAt());
        
        // Calculate progress
        int progress = calculateProgress(goal);
        goal.setProgress(progress);
        
        // Set status based on progress
        if (progress >= 100) {
            goal.setStatus("completed");
        } else if (progress > 0) {
            goal.setStatus("in-progress");
        } else {
            goal.setStatus("not-started");
        }
        
        Goal savedGoal = goalRepository.save(goal);
        return convertToDto(savedGoal);
    }
    
    @Transactional
    public void deleteGoal(String id, UserDetailsImpl user) {
        goalRepository.findById(id)
                .filter(g -> g.getUserId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Goal not found or unauthorized"));
        
        goalRepository.deleteById(id);
    }
    
    // Helper methods for DTO conversion and calculations
    private GoalDto convertToDto(Goal goal) {
        return GoalDto.builder()
                .id(goal.getId())
                .title(goal.getTitle())
                .description(goal.getDescription())
                .target(goal.getTarget())
                .current(goal.getCurrent())
                .type(goal.getType())
                .status(goal.getStatus())
                .deadline(goal.getDeadline() != null ? goal.getDeadline().toString() : null)
                .createdAt(goal.getCreatedAt() != null ? goal.getCreatedAt().toString() : null)
                .progress(goal.getProgress())
                .build();
    }
    
    private Goal convertToEntity(GoalDto dto) {
        return Goal.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .description(dto.getDescription())
                .target(dto.getTarget())
                .current(dto.getCurrent())
                .type(dto.getType())
                .status(dto.getStatus())
                .deadline(dto.getDeadline() != null ? LocalDate.parse(dto.getDeadline()) : null)
                .createdAt(dto.getCreatedAt() != null ? LocalDate.parse(dto.getCreatedAt()) : null)
                .progress(dto.getProgress())
                .build();
    }
    
    private int calculateProgress(Goal goal) {
        if (goal.getTarget() <= 0) {
            return 0;
        }
        
        double progressPercentage = (goal.getCurrent() / goal.getTarget()) * 100;
        return (int) Math.min(100, Math.max(0, Math.round(progressPercentage)));
    }
}


package com.fitness.application.service;

import com.fitness.application.dto.WorkoutDto;
import com.fitness.application.model.Workout;
import com.fitness.application.repository.WorkoutRepository;
import com.fitness.application.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkoutService {
    private final WorkoutRepository workoutRepository;
    private final StreakService streakService;
    
    public List<WorkoutDto> getAllWorkouts(UserDetailsImpl user) {
        return workoutRepository.findByUserIdOrderByDateDesc(user.getId())
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<WorkoutDto> getWorkoutsByDateRange(UserDetailsImpl user, int days) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days);
        
        return workoutRepository.findByUserIdAndDateBetween(user.getId(), startDate, endDate)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public WorkoutDto getWorkoutById(String id, UserDetailsImpl user) {
        return workoutRepository.findById(id)
                .filter(workout -> workout.getUserId().equals(user.getId()))
                .map(this::convertToDto)
                .orElseThrow(() -> new RuntimeException("Workout not found"));
    }
    
    @Transactional
    public WorkoutDto createWorkout(WorkoutDto workoutDto, UserDetailsImpl user) {
        Workout workout = convertToEntity(workoutDto);
        workout.setUserId(user.getId());
        
        // If the workout is completed and it's today or in the past, update streak
        if (workout.isCompleted() && !workout.getDate().isAfter(LocalDate.now())) {
            streakService.updateStreak(user.getId(), workout.getDate());
        }
        
        Workout savedWorkout = workoutRepository.save(workout);
        return convertToDto(savedWorkout);
    }
    
    @Transactional
    public WorkoutDto updateWorkout(String id, WorkoutDto workoutDto, UserDetailsImpl user) {
        // Verify workout exists and belongs to user
        Workout existingWorkout = workoutRepository.findById(id)
                .filter(w -> w.getUserId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Workout not found or unauthorized"));
        
        boolean wasCompleted = existingWorkout.isCompleted();
        LocalDate oldDate = existingWorkout.getDate();
        
        // Update the existing workout with new values
        Workout workout = convertToEntity(workoutDto);
        workout.setId(id);
        workout.setUserId(user.getId());
        
        // Check if completion status changed
        if (!wasCompleted && workout.isCompleted()) {
            // Workout was marked as completed, update streak
            streakService.updateStreak(user.getId(), workout.getDate());
        } else if (wasCompleted && !workout.isCompleted() && oldDate.equals(workout.getDate())) {
            // Workout was marked as incomplete, might need to recalculate streak
            streakService.recalculateStreak(user.getId());
        } else if (wasCompleted && workout.isCompleted() && !oldDate.equals(workout.getDate())) {
            // Completed workout date changed, recalculate streak
            streakService.recalculateStreak(user.getId());
        }
        
        Workout savedWorkout = workoutRepository.save(workout);
        return convertToDto(savedWorkout);
    }
    
    @Transactional
    public void deleteWorkout(String id, UserDetailsImpl user) {
        Workout workout = workoutRepository.findById(id)
                .filter(w -> w.getUserId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Workout not found or unauthorized"));
        
        workoutRepository.delete(workout);
        
        // If deleted workout was completed, recalculate streak
        if (workout.isCompleted()) {
            streakService.recalculateStreak(user.getId());
        }
    }
    
    public WorkoutDto toggleWorkoutCompletion(String id, UserDetailsImpl user) {
        Workout workout = workoutRepository.findById(id)
                .filter(w -> w.getUserId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Workout not found or unauthorized"));
        
        workout.setCompleted(!workout.isCompleted());
        
        // Update streak based on the new completion status
        if (workout.isCompleted()) {
            streakService.updateStreak(user.getId(), workout.getDate());
        } else {
            streakService.recalculateStreak(user.getId());
        }
        
        Workout savedWorkout = workoutRepository.save(workout);
        return convertToDto(savedWorkout);
    }
    
    // Helper methods for DTO conversion
    private WorkoutDto convertToDto(Workout workout) {
        return WorkoutDto.builder()
                .id(workout.getId())
                .title(workout.getTitle())
                .type(workout.getType())
                .duration(workout.getDuration())
                .calories(workout.getCalories())
                .exercises(workout.getExercises())
                .date(workout.getDate().toString())
                .completed(workout.isCompleted())
                .notes(workout.getNotes())
                .build();
    }
    
    private Workout convertToEntity(WorkoutDto dto) {
        return Workout.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .type(dto.getType())
                .duration(dto.getDuration())
                .calories(dto.getCalories())
                .exercises(dto.getExercises())
                .date(LocalDate.parse(dto.getDate()))
                .completed(dto.isCompleted())
                .notes(dto.getNotes())
                .build();
    }
}

package com.fitness.application.service;

import com.fitness.application.dto.StreakDto;
import com.fitness.application.model.Streak;
import com.fitness.application.model.Workout;
import com.fitness.application.repository.StreakRepository;
import com.fitness.application.repository.WorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StreakService {
    private final StreakRepository streakRepository;
    private final WorkoutRepository workoutRepository;
    
    public StreakDto getUserStreak(String userId) {
        Streak streak = streakRepository.findByUserId(userId)
                .orElse(Streak.builder()
                        .userId(userId)
                        .currentStreak(0)
                        .longestStreak(0)
                        .build());
        
        return convertToDto(streak);
    }
    
    @Transactional
    public void updateStreak(String userId, LocalDate workoutDate) {
        Streak streak = streakRepository.findByUserId(userId)
                .orElse(Streak.builder()
                        .userId(userId)
                        .currentStreak(0)
                        .longestStreak(0)
                        .build());
        
        LocalDate today = LocalDate.now();
        
        // Don't count future workouts for streaks
        if (workoutDate.isAfter(today)) {
            return;
        }
        
        // If first workout ever or no workouts in a long time
        if (streak.getLastWorkoutDate() == null) {
            streak.setCurrentStreak(1);
            streak.setLastWorkoutDate(workoutDate);
        } else {
            LocalDate lastDate = streak.getLastWorkoutDate();
            
            // If this workout is more recent than the last one
            if (workoutDate.isAfter(lastDate)) {
                long daysBetween = ChronoUnit.DAYS.between(lastDate, workoutDate);
                
                // Check if the days are consecutive or same day (duplicate workout)
                if (daysBetween == 1) {
                    // Consecutive days - increase streak
                    streak.setCurrentStreak(streak.getCurrentStreak() + 1);
                    streak.setLastWorkoutDate(workoutDate);
                } else if (daysBetween > 1) {
                    // Gap in workout days - reset streak to 1
                    streak.setCurrentStreak(1);
                    streak.setLastWorkoutDate(workoutDate);
                }
                // If same day, no change to streak
            }
            // If this workout is older, no change to current streak
        }
        
        // Update longest streak if needed
        if (streak.getCurrentStreak() > streak.getLongestStreak()) {
            streak.setLongestStreak(streak.getCurrentStreak());
        }
        
        streakRepository.save(streak);
        
        // Check if streak should be broken due to missed days
        checkAndUpdateMissedDays(streak.getUserId());
    }
    
    @Transactional
    public void recalculateStreak(String userId) {
        // Get all completed workouts for user, sorted by date
        List<Workout> completedWorkouts = workoutRepository.findByUserId(userId).stream()
                .filter(Workout::isCompleted)
                .sorted(Comparator.comparing(Workout::getDate))
                .collect(Collectors.toList());
        
        // If no completed workouts, reset streak to 0
        if (completedWorkouts.isEmpty()) {
            Streak streak = streakRepository.findByUserId(userId)
                    .orElse(Streak.builder().userId(userId).build());
            streak.setCurrentStreak(0);
            streak.setLastWorkoutDate(null);
            // Keep longest streak as is
            streakRepository.save(streak);
            return;
        }
        
        // Calculate the current streak
        int currentStreak = 1;
        int maxStreak = 1;
        LocalDate lastDate = completedWorkouts.get(0).getDate();
        
        for (int i = 1; i < completedWorkouts.size(); i++) {
            LocalDate currentDate = completedWorkouts.get(i).getDate();
            
            // Skip duplicate dates
            if (currentDate.equals(lastDate)) {
                continue;
            }
            
            long daysBetween = ChronoUnit.DAYS.between(lastDate, currentDate);
            
            if (daysBetween == 1) {
                // Consecutive days
                currentStreak++;
                if (currentStreak > maxStreak) {
                    maxStreak = currentStreak;
                }
            } else if (daysBetween > 1) {
                // Gap found, reset streak
                currentStreak = 1;
            }
            
            lastDate = currentDate;
        }
        
        // Update streak record
        Streak streak = streakRepository.findByUserId(userId)
                .orElse(Streak.builder().userId(userId).build());
        
        streak.setCurrentStreak(currentStreak);
        streak.setLastWorkoutDate(lastDate);
        
        // Update longest streak if newly calculated max is higher than stored longest
        if (maxStreak > streak.getLongestStreak()) {
            streak.setLongestStreak(maxStreak);
        }
        
        streakRepository.save(streak);
        
        // Check if streak should be broken due to missed days
        checkAndUpdateMissedDays(userId);
    }
    
    private void checkAndUpdateMissedDays(String userId) {
        Optional<Streak> streakOpt = streakRepository.findByUserId(userId);
        if (streakOpt.isEmpty() || streakOpt.get().getLastWorkoutDate() == null) {
            return;
        }
        
        Streak streak = streakOpt.get();
        LocalDate lastWorkoutDate = streak.getLastWorkoutDate();
        LocalDate today = LocalDate.now();
        
        // If more than 1 day has passed since the last workout, break the streak
        long daysSinceLastWorkout = ChronoUnit.DAYS.between(lastWorkoutDate, today);
        if (daysSinceLastWorkout > 1) {
            streak.setCurrentStreak(0);
            streakRepository.save(streak);
        }
    }
    
    // Helper method for DTO conversion
    private StreakDto convertToDto(Streak streak) {
        return StreakDto.builder()
                .currentStreak(streak.getCurrentStreak())
                .longestStreak(streak.getLongestStreak())
                .lastWorkoutDate(streak.getLastWorkoutDate() != null ? streak.getLastWorkoutDate().toString() : null)
                .build();
    }
}

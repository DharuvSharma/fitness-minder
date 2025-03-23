
package com.fitness.application.controller;

import com.fitness.application.dto.WorkoutDto;
import com.fitness.application.security.UserDetailsImpl;
import com.fitness.application.service.WorkoutService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workouts")
@RequiredArgsConstructor
public class WorkoutController {
    private final WorkoutService workoutService;
    
    @GetMapping
    public ResponseEntity<List<WorkoutDto>> getAllWorkouts(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<WorkoutDto> workouts = workoutService.getAllWorkouts(userDetails);
        return ResponseEntity.ok(workouts);
    }
    
    @GetMapping("/range")
    public ResponseEntity<List<WorkoutDto>> getWorkoutsByDateRange(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(defaultValue = "7") int days) {
        List<WorkoutDto> workouts = workoutService.getWorkoutsByDateRange(userDetails, days);
        return ResponseEntity.ok(workouts);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<WorkoutDto> getWorkoutById(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        WorkoutDto workout = workoutService.getWorkoutById(id, userDetails);
        return ResponseEntity.ok(workout);
    }
    
    @PostMapping
    public ResponseEntity<WorkoutDto> createWorkout(
            @Valid @RequestBody WorkoutDto workoutDto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        WorkoutDto createdWorkout = workoutService.createWorkout(workoutDto, userDetails);
        return ResponseEntity.ok(createdWorkout);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<WorkoutDto> updateWorkout(
            @PathVariable String id,
            @Valid @RequestBody WorkoutDto workoutDto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        WorkoutDto updatedWorkout = workoutService.updateWorkout(id, workoutDto, userDetails);
        return ResponseEntity.ok(updatedWorkout);
    }
    
    @PutMapping("/{id}/toggle-completion")
    public ResponseEntity<WorkoutDto> toggleWorkoutCompletion(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        WorkoutDto updatedWorkout = workoutService.toggleWorkoutCompletion(id, userDetails);
        return ResponseEntity.ok(updatedWorkout);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkout(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        workoutService.deleteWorkout(id, userDetails);
        return ResponseEntity.noContent().build();
    }
}

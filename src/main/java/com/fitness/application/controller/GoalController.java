
package com.fitness.application.controller;

import com.fitness.application.dto.GoalDto;
import com.fitness.application.security.UserDetailsImpl;
import com.fitness.application.service.GoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {
    private final GoalService goalService;
    
    @GetMapping
    public ResponseEntity<List<GoalDto>> getAllGoals(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<GoalDto> goals = goalService.getAllGoals(userDetails);
        return ResponseEntity.ok(goals);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<GoalDto> getGoalById(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        GoalDto goal = goalService.getGoalById(id, userDetails);
        return ResponseEntity.ok(goal);
    }
    
    @PostMapping
    public ResponseEntity<GoalDto> createGoal(
            @Valid @RequestBody GoalDto goalDto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        GoalDto createdGoal = goalService.createGoal(goalDto, userDetails);
        return ResponseEntity.ok(createdGoal);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<GoalDto> updateGoal(
            @PathVariable String id,
            @Valid @RequestBody GoalDto goalDto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        GoalDto updatedGoal = goalService.updateGoal(id, goalDto, userDetails);
        return ResponseEntity.ok(updatedGoal);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        goalService.deleteGoal(id, userDetails);
        return ResponseEntity.noContent().build();
    }
}

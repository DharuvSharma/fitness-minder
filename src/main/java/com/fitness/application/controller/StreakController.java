
package com.fitness.application.controller;

import com.fitness.application.dto.StreakDto;
import com.fitness.application.security.UserDetailsImpl;
import com.fitness.application.service.StreakService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/streaks")
@RequiredArgsConstructor
public class StreakController {
    private final StreakService streakService;
    
    @GetMapping
    public ResponseEntity<StreakDto> getUserStreak(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        StreakDto streak = streakService.getUserStreak(userDetails.getId());
        return ResponseEntity.ok(streak);
    }
}

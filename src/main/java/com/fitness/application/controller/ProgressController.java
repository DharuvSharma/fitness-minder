
package com.fitness.application.controller;

import com.fitness.application.dto.ProgressDto;
import com.fitness.application.security.UserDetailsImpl;
import com.fitness.application.service.ProgressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {
    private final ProgressService progressService;
    
    @GetMapping
    public ResponseEntity<List<ProgressDto>> getUserProgress(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(defaultValue = "weight") String category) {
        List<ProgressDto> progressData = progressService.getUserProgress(userDetails, category);
        return ResponseEntity.ok(progressData);
    }
    
    @PostMapping
    public ResponseEntity<ProgressDto> addProgressData(
            @Valid @RequestBody ProgressDto progressDto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        ProgressDto savedProgress = progressService.addProgressData(progressDto, userDetails);
        return ResponseEntity.ok(savedProgress);
    }
}

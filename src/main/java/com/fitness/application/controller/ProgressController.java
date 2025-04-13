
package com.fitness.application.controller;

import com.fitness.application.dto.ProgressDto;
import com.fitness.application.security.UserDetailsImpl;
import com.fitness.application.service.ProgressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping({"/api/progress", "/api/v1/progress"})
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
    
    @GetMapping("/range")
    public ResponseEntity<List<ProgressDto>> getProgressByDateRange(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(defaultValue = "weight") String category,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        LocalDate start = startDate != null ? LocalDate.parse(startDate) : LocalDate.now().minusMonths(1);
        LocalDate end = endDate != null ? LocalDate.parse(endDate) : LocalDate.now();
        
        List<ProgressDto> progressData = progressService.getProgressByDateRange(userDetails, category, start, end);
        return ResponseEntity.ok(progressData);
    }
    
    @PostMapping
    public ResponseEntity<ProgressDto> addProgressData(
            @Valid @RequestBody ProgressDto progressDto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        ProgressDto savedProgress = progressService.addProgressData(progressDto, userDetails);
        return ResponseEntity.ok(savedProgress);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ProgressDto> updateProgressData(
            @PathVariable String id,
            @Valid @RequestBody ProgressDto progressDto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        progressDto.setId(id); // Ensure ID is set correctly
        ProgressDto updatedProgress = progressService.updateProgressData(progressDto, userDetails);
        return ResponseEntity.ok(updatedProgress);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgressData(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        progressService.deleteProgressData(id, userDetails);
        return ResponseEntity.noContent().build();
    }
}

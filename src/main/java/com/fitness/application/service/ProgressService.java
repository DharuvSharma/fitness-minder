
package com.fitness.application.service;

import com.fitness.application.dto.ProgressDto;
import com.fitness.application.model.Progress;
import com.fitness.application.repository.ProgressRepository;
import com.fitness.application.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgressService {
    private final ProgressRepository progressRepository;
    
    @Cacheable(value = "progress", key = "#user.id + '_' + #category")
    public List<ProgressDto> getUserProgress(UserDetailsImpl user, String category) {
        return progressRepository.findByUserIdAndCategoryOrderByDateDesc(user.getId(), category)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Cacheable(value = "progress", key = "#user.id + '_' + #category + '_range_' + #start + '_' + #end")
    public List<ProgressDto> getProgressByDateRange(UserDetailsImpl user, String category, LocalDate start, LocalDate end) {
        return progressRepository.findByUserIdAndCategoryAndDateBetween(user.getId(), category, start, end)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional
    @Caching(
        evict = { 
            @CacheEvict(value = "progress", key = "#user.id + '_' + #progressDto.category"),
            @CacheEvict(value = "progress", allEntries = true)
        }
    )
    public ProgressDto addProgressData(ProgressDto progressDto, UserDetailsImpl user) {
        Progress progress = convertToEntity(progressDto);
        progress.setUserId(user.getId());
        
        Progress savedProgress = progressRepository.save(progress);
        return convertToDto(savedProgress);
    }
    
    @Transactional
    @CachePut(value = "progress", key = "#result.id")
    @CacheEvict(value = "progress", allEntries = true)
    public ProgressDto updateProgressData(ProgressDto progressDto, UserDetailsImpl user) {
        Progress existingProgress = progressRepository.findById(progressDto.getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Progress data not found"));
        
        // Verify user owns this data
        if (!existingProgress.getUserId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to update this progress data");
        }
        
        // Update fields
        existingProgress.setCategory(progressDto.getCategory());
        existingProgress.setDate(LocalDate.parse(progressDto.getDate()));
        existingProgress.setValue(progressDto.getValue());
        existingProgress.setAdditionalData(progressDto.getAdditionalData());
        
        Progress updatedProgress = progressRepository.save(existingProgress);
        return convertToDto(updatedProgress);
    }
    
    @Transactional
    @Caching(
        evict = {
            @CacheEvict(value = "progress", key = "#id"),
            @CacheEvict(value = "progress", allEntries = true)
        }
    )
    public void deleteProgressData(String id, UserDetailsImpl user) {
        Progress existingProgress = progressRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Progress data not found"));
        
        // Verify user owns this data
        if (!existingProgress.getUserId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to delete this progress data");
        }
        
        progressRepository.deleteById(id);
    }
    
    // Helper methods for DTO conversion
    private ProgressDto convertToDto(Progress progress) {
        return ProgressDto.builder()
                .id(progress.getId())
                .category(progress.getCategory())
                .date(progress.getDate().toString())
                .value(progress.getValue())
                .additionalData(progress.getAdditionalData())
                .build();
    }
    
    private Progress convertToEntity(ProgressDto dto) {
        return Progress.builder()
                .id(dto.getId())
                .category(dto.getCategory())
                .date(LocalDate.parse(dto.getDate()))
                .value(dto.getValue())
                .additionalData(dto.getAdditionalData())
                .build();
    }
}

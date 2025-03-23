
package com.fitness.application.service;

import com.fitness.application.dto.ProgressDto;
import com.fitness.application.model.Progress;
import com.fitness.application.repository.ProgressRepository;
import com.fitness.application.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgressService {
    private final ProgressRepository progressRepository;
    
    public List<ProgressDto> getUserProgress(UserDetailsImpl user, String category) {
        return progressRepository.findByUserIdAndCategoryOrderByDateDesc(user.getId(), category)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public ProgressDto addProgressData(ProgressDto progressDto, UserDetailsImpl user) {
        Progress progress = convertToEntity(progressDto);
        progress.setUserId(user.getId());
        
        Progress savedProgress = progressRepository.save(progress);
        return convertToDto(savedProgress);
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

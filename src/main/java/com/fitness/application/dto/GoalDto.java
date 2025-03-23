
package com.fitness.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoalDto {
    private String id;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotNull(message = "Target value is required")
    private Double target;
    
    @NotNull(message = "Current value is required")
    private Double current;
    
    @NotBlank(message = "Goal type is required")
    private String type;
    
    private String status;
    private String deadline;
    private String createdAt;
    private Integer progress;
}

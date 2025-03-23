
package com.fitness.application.dto;

import jakarta.validation.constraints.Min;
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
public class WorkoutDto {
    private String id;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Type is required")
    private String type;
    
    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 minute")
    private Integer duration;
    
    @NotNull(message = "Calories is required")
    @Min(value = 0, message = "Calories must be non-negative")
    private Integer calories;
    
    @NotNull(message = "Number of exercises is required")
    @Min(value = 1, message = "Must have at least 1 exercise")
    private Integer exercises;
    
    @NotBlank(message = "Date is required")
    private String date;
    
    private boolean completed;
    private String notes;
}

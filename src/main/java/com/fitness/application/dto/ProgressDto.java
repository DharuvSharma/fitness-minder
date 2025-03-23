
package com.fitness.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgressDto {
    private String id;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    @NotBlank(message = "Date is required")
    private String date;
    
    @NotNull(message = "Value is required")
    private Double value;
    
    private Map<String, Object> additionalData;
}

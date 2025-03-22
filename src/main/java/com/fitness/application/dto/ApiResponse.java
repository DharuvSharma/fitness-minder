
package com.fitness.application.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApiResponse {
    private boolean success;
    private String message;
}

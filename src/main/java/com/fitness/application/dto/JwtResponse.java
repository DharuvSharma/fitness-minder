
package com.fitness.application.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JwtResponse {
    private String token;
    private String id;
    private String name;
    private String email;
}

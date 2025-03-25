
package com.fitness.application.dto;

import lombok.Builder;
import lombok.Data;

/**
 * Data Transfer Object (DTO) for authentication responses.
 * This simplified class contains just the essential user information
 * and the token needed for authentication.
 */
@Data
@Builder
public class JwtResponse {
    private String token;   // JWT token for authentication
    private String id;      // User ID
    private String name;    // User's display name
    private String email;   // User's email
}

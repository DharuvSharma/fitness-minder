
package com.fitness.application.dto;

import lombok.Builder;
import lombok.Data;

/**
 * Data Transfer Object (DTO) for JWT authentication responses.
 * This class represents the data returned to the client after successful authentication.
 * It contains the JWT token and basic user information.
 * 
 * The JWT token is used for subsequent authenticated requests.
 * User details are included to immediately populate the UI after login.
 */
@Data // Lombok annotation for automatic getters, setters, equals, hashCode, and toString
@Builder // Lombok annotation for automatic builder pattern implementation
public class JwtResponse {
    private String token;   // JWT token for authentication
    private String id;      // User ID
    private String name;    // User's display name
    private String email;   // User's email (also serves as username)
}

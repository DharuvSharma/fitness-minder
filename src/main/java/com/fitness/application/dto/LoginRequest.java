
package com.fitness.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Data Transfer Object (DTO) for login requests.
 * This class captures user credentials from the login form.
 * It uses validation annotations to ensure data integrity.
 * 
 * The validation annotations (@NotBlank, @Email) provide automatic
 * input validation when this object is bound to HTTP requests with @Valid.
 */
@Data // Lombok annotation that automatically generates getters, setters, equals, hashCode, and toString methods
public class LoginRequest {
    @NotBlank(message = "Email is required") // Ensures email field is not empty
    @Email(message = "Email must be valid") // Validates email format
    private String email;
    
    @NotBlank(message = "Password is required") // Ensures password field is not empty
    private String password;
}

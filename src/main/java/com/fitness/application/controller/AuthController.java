
package com.fitness.application.controller;

import com.fitness.application.dto.ApiResponse;
import com.fitness.application.dto.JwtResponse;
import com.fitness.application.dto.RegisterRequest;
import com.fitness.application.model.User;
import com.fitness.application.repository.UserRepository;
import com.fitness.application.security.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Set;

/**
 * REST Controller for handling authentication-related endpoints.
 * With login removed, this controller now handles only registration.
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;
    
    @Autowired
    UserRepository userRepository;
    
    @Autowired
    PasswordEncoder encoder;
    
    @Autowired
    JwtUtils jwtUtils;
    
    /**
     * Handles user registration requests.
     * Creates a new user account if the email is not already in use.
     * 
     * Registration flow:
     * 1. Validate registration data
     * 2. Check if email already exists
     * 3. Create user with encoded password
     * 4. Save user to database
     * 
     * @param registerRequest The registration details (name, email, password)
     * @return Success message if registration is successful
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        // Check if email already exists to prevent duplicate accounts
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.builder()
                            .success(false)
                            .message("Error: Email is already in use!")
                            .build());
        }
        
        // Create new user's account with Builder pattern
        User user = User.builder()
                .name(registerRequest.getName())
                .email(registerRequest.getEmail())
                .password(encoder.encode(registerRequest.getPassword()))
                .build();
        
        // Default role for new users
        Set<String> roles = new HashSet<>();
        roles.add("ROLE_USER");
        user.setRoles(roles);
        
        // Save user to database
        userRepository.save(user);
        
        // Return success response
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("User registered successfully!")
                .build());
    }
}


package com.fitness.application.controller;

import com.fitness.application.dto.ApiResponse;
import com.fitness.application.dto.JwtResponse;
import com.fitness.application.dto.LoginRequest;
import com.fitness.application.dto.RegisterRequest;
import com.fitness.application.model.User;
import com.fitness.application.repository.UserRepository;
import com.fitness.application.security.JwtUtils;
import com.fitness.application.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Set;

/**
 * REST Controller for handling authentication-related endpoints.
 * This controller manages user login and registration.
 */
@CrossOrigin(origins = "*", maxAge = 3600) // Allow cross-origin requests from any domain with a max age of 1 hour
@RestController // Marks this class as a controller where every method returns a domain object instead of a view
@RequestMapping("/api/auth") // All endpoints in this controller will start with /api/auth
public class AuthController {
    @Autowired // Injects the authentication manager bean
    AuthenticationManager authenticationManager;
    
    @Autowired // Injects the user repository for database operations
    UserRepository userRepository;
    
    @Autowired // Injects the password encoder for secure password handling
    PasswordEncoder encoder;
    
    @Autowired // Injects utilities for JWT token generation and validation
    JwtUtils jwtUtils;
    
    /**
     * Handles user login requests.
     * Validates credentials, generates a JWT token, and returns user details.
     * 
     * @param loginRequest The login credentials (email and password)
     * @return JWT token and user details if authentication is successful
     */
    @PostMapping("/login") // Maps to POST /api/auth/login
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        // Authenticate user with provided credentials
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        
        // Set authentication in security context
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        // Generate JWT token
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        // Get user details from authenticated user
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        // Return token and user info
        return ResponseEntity.ok(JwtResponse.builder()
                .token(jwt)
                .id(userDetails.getId())
                .name(userDetails.getName())
                .email(userDetails.getUsername())
                .build());
    }
    
    /**
     * Handles user registration requests.
     * Creates a new user account if the email is not already in use.
     * 
     * @param registerRequest The registration details (name, email, password)
     * @return Success message if registration is successful
     */
    @PostMapping("/register") // Maps to POST /api/auth/register
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        // Check if email already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.builder()
                            .success(false)
                            .message("Error: Email is already in use!")
                            .build());
        }
        
        // Create new user's account
        User user = User.builder()
                .name(registerRequest.getName())
                .email(registerRequest.getEmail())
                .password(encoder.encode(registerRequest.getPassword())) // Encrypt the password
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

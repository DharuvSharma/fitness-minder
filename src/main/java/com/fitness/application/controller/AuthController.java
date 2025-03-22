
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
    
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        return ResponseEntity.ok(JwtResponse.builder()
                .token(jwt)
                .id(userDetails.getId())
                .name(userDetails.getName())
                .email(userDetails.getUsername())
                .build());
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
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
                .password(encoder.encode(registerRequest.getPassword()))
                .build();
        
        // Default role for new users
        Set<String> roles = new HashSet<>();
        roles.add("ROLE_USER");
        user.setRoles(roles);
        
        userRepository.save(user);
        
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("User registered successfully!")
                .build());
    }
}

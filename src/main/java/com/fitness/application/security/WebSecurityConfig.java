
package com.fitness.application.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Spring Security configuration class.
 * 
 * This class configures security settings for the application, including:
 * - Authentication provider
 * - Password encoding
 * - CORS settings
 * - HTTP security rules
 * - JWT token filter
 */
@Configuration // Indicates this is a configuration class
@EnableWebSecurity // Enables Spring Security's web security support
@EnableMethodSecurity // Enables method-level security
public class WebSecurityConfig {
    @Value("${app.cors.allowed-origins}") // Inject from application.properties
    private String allowedOrigins; // Origins allowed to access the API
    
    @Autowired
    UserDetailsServiceImpl userDetailsService; // Service to load user details
    
    @Autowired
    private AuthEntryPointJwt unauthorizedHandler; // Handles unauthorized requests
    
    /**
     * Creates the JWT token filter bean.
     * This filter intercepts requests to extract and validate JWT tokens.
     * 
     * @return The JWT authentication filter
     */
    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }
    
    /**
     * Configures the authentication provider with user details service and password encoder.
     * This provider handles the actual authentication process.
     * 
     * @return The configured authentication provider
     */
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        
        authProvider.setUserDetailsService(userDetailsService); // Set user details service
        authProvider.setPasswordEncoder(passwordEncoder()); // Set password encoder
        
        return authProvider;
    }
    
    /**
     * Creates the authentication manager bean.
     * This manager is used to authenticate users during login.
     * 
     * @param authConfig The authentication configuration
     * @return The authentication manager
     * @throws Exception If an error occurs
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
    
    /**
     * Creates the password encoder bean.
     * This encoder is used to hash and verify passwords.
     * 
     * @return The BCrypt password encoder
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Use BCrypt for password hashing
    }
    
    /**
     * Configures CORS (Cross-Origin Resource Sharing) settings.
     * This allows controlled access from different origins.
     * 
     * @return The CORS configuration source
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(","))); // Set allowed origins
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")); // Set allowed HTTP methods
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With")); // Set allowed headers
        configuration.setExposedHeaders(Arrays.asList("Authorization")); // Headers clients can access
        configuration.setAllowCredentials(true); // Allow including credentials
        configuration.setMaxAge(3600L); // Cache preflight requests for 1 hour
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Apply to all paths
        return source;
    }
    
    /**
     * Configures HTTP security settings.
     * This defines access rules, CSRF protection, session management, etc.
     * 
     * @param http The HTTP security configuration
     * @return The configured security filter chain
     * @throws Exception If an error occurs
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable()) // Disable CSRF protection (using JWT instead)
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Configure CORS
            .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler)) // Handle unauthorized requests
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Use stateless sessions
            .authorizeHttpRequests(auth -> 
                auth.requestMatchers("/api/auth/**").permitAll() // Allow unauthenticated access to auth endpoints
                    .requestMatchers("/api/public/**").permitAll() // Allow unauthenticated access to public endpoints
                    .anyRequest().authenticated() // Require authentication for all other endpoints
            );
        
        http.authenticationProvider(authenticationProvider()); // Set authentication provider
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class); // Add JWT filter
        
        return http.build();
    }
}

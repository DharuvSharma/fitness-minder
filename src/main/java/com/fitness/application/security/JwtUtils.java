
package com.fitness.application.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Utility class for JWT token operations.
 * This class handles JWT token generation, validation, and parsing.
 * 
 * JWT (JSON Web Token) is used for secure transmission of information between parties.
 * It contains encoded user information and is signed to ensure integrity.
 */
@Slf4j // Lombok annotation for automatic logger field creation
@Component // Spring annotation marking this as a component to be managed by Spring
public class JwtUtils {
    @Value("${app.jwt.secret}") // Injects value from application.properties
    private String jwtSecret; // Secret key used for JWT signature

    @Value("${app.jwt.expiration}") // Injects value from application.properties
    private long jwtExpirationMs; // Token expiration time in milliseconds

    /**
     * Generates a JWT token for an authenticated user.
     * 
     * The token includes:
     * - User ID
     * - User name
     * - User email (as subject)
     * - Issued timestamp
     * - Expiration timestamp
     * - Signature using HS512 algorithm
     *
     * @param authentication The authenticated user information
     * @return JWT token string
     */
    public String generateJwtToken(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        
        // Add additional claims to the token
        // Claims are pieces of information asserted about the subject
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", userPrincipal.getId());
        claims.put("name", userPrincipal.getName());
        
        return Jwts.builder()
                .setClaims(claims) // Set additional claims
                .setSubject(userPrincipal.getUsername()) // Set subject (email)
                .setIssuedAt(new Date()) // Set issued time to now
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs)) // Set expiration time
                .signWith(getSigningKey(), SignatureAlgorithm.HS512) // Sign with HS512 algorithm
                .compact(); // Build compact JWT
    }
    
    /**
     * Extracts the username (email) from a JWT token.
     * 
     * @param token The JWT token
     * @return The username (email) from the token
     */
    public String getUsernameFromJwtToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token) // Parse and verify the JWT
                .getBody() // Get the claims body
                .getSubject(); // Get the subject claim (email)
    }
    
    /**
     * Validates a JWT token.
     * 
     * Checks for:
     * - Valid signature
     * - Well-formed token
     * - Non-expired token
     * - Supported format
     * 
     * @param authToken The JWT token to validate
     * @return true if token is valid, false otherwise
     */
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(authToken); // If this completes without exception, token is valid
            return true;
        } catch (SecurityException e) {
            log.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
        }
        
        return false;
    }
    
    /**
     * Creates a signing key from the JWT secret.
     * 
     * @return SecretKey for signing JWT tokens
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes); // Create HMAC-SHA key
    }
}

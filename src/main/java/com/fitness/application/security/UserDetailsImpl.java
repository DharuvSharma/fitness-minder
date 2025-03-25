
package com.fitness.application.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fitness.application.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Implementation of Spring Security's UserDetails interface.
 * 
 * This class adapts our custom User model to Spring Security's authentication system.
 * It provides the core user information required by Spring Security for authentication
 * and authorization.
 */
@AllArgsConstructor // Lombok annotation for automatic all-args constructor
public class UserDetailsImpl implements UserDetails {
    private static final long serialVersionUID = 1L;
    
    @Getter // Lombok annotation for automatic getter methods
    private String id; // User ID
    
    private String email; // User email (used as username)
    
    @Getter
    private String name; // User display name
    
    @JsonIgnore // Prevents password from being serialized to JSON
    private String password; // User password (encrypted)
    
    private Collection<? extends GrantedAuthority> authorities; // User roles/permissions
    
    /**
     * Creates a UserDetailsImpl instance from a User model.
     * 
     * This static factory method converts our application-specific User model
     * to Spring Security's UserDetails implementation.
     * 
     * @param user The application User model
     * @return A UserDetailsImpl instance representing the user
     */
    public static UserDetailsImpl build(User user) {
        // Convert user roles to Spring Security GrantedAuthority objects
        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
        
        // Create and return a new UserDetailsImpl instance
        return new UserDetailsImpl(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getPassword(),
                authorities);
    }
    
    /**
     * Returns the authorities (roles) granted to the user.
     * Used by Spring Security for authorization decisions.
     * 
     * @return collection of granted authorities
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }
    
    /**
     * Returns the user's password.
     * Used by Spring Security for authentication.
     * 
     * @return the user's (encrypted) password
     */
    @Override
    public String getPassword() {
        return password;
    }
    
    /**
     * Returns the username (email in our case).
     * Used by Spring Security as the principal identifier.
     * 
     * @return the user's email (username)
     */
    @Override
    public String getUsername() {
        return email;
    }
    
    /**
     * Indicates if the user's account has not expired.
     * Always returns true in this implementation.
     * 
     * @return true if the account is not expired
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    
    /**
     * Indicates if the user's account is not locked.
     * Always returns true in this implementation.
     * 
     * @return true if the account is not locked
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    
    /**
     * Indicates if the user's credentials (password) have not expired.
     * Always returns true in this implementation.
     * 
     * @return true if credentials are not expired
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    /**
     * Indicates if the user is enabled and can be authenticated.
     * Always returns true in this implementation.
     * 
     * @return true if the user is enabled
     */
    @Override
    public boolean isEnabled() {
        return true;
    }
    
    /**
     * Compares this UserDetailsImpl to another object for equality.
     * Two UserDetailsImpl instances are equal if they have the same ID.
     * 
     * @param o the object to compare with
     * @return true if equal, false otherwise
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserDetailsImpl user = (UserDetailsImpl) o;
        return Objects.equals(id, user.id);
    }
    
    /**
     * Returns a hash code value for this UserDetailsImpl.
     * 
     * @return a hash code value
     */
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}

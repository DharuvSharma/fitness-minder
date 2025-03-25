
package com.fitness.application.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

/**
 * User entity model.
 * 
 * This class represents a user in the application and maps to the "users" collection
 * in MongoDB. It contains all user properties and is used for authentication and
 * user management.
 */
@Data // Lombok annotation for automatic getters, setters, equals, hashCode, and toString
@Builder // Lombok annotation for automatic builder pattern implementation
@NoArgsConstructor // Lombok annotation for automatic no-args constructor
@AllArgsConstructor // Lombok annotation for automatic all-args constructor
@Document(collection = "users") // MongoDB document annotation, maps to "users" collection
public class User {
    @Id // Marks this field as the document ID
    private String id; // Unique identifier for the user
    
    private String name; // User's display name
    
    @Indexed(unique = true) // Creates a unique index on email field
    private String email; // User's email (used as username for login)
    
    private String password; // User's password (stored in encrypted form)
    
    private Set<String> roles = new HashSet<>(); // User's roles (e.g., "ROLE_USER", "ROLE_ADMIN")
}

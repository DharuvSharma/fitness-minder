
package com.fitness.application.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "progress")
public class Progress {
    @Id
    private String id;
    private String userId;
    private String category; // weight, strength
    private LocalDate date;
    private double value;
    private Map<String, Object> additionalData; // For strength progress: exercise, reps, weight, etc.
}

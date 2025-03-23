
package com.fitness.application.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "goals")
public class Goal {
    @Id
    private String id;
    private String userId;
    private String title;
    private String description;
    private double target;
    private double current;
    private String type; // weight, strength, endurance, habit, custom
    private String status; // in-progress, completed, not-started
    private LocalDate deadline;
    private LocalDate createdAt;
    private int progress; // 0-100
}

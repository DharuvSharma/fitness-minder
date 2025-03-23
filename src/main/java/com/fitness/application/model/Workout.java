
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
@Document(collection = "workouts")
public class Workout {
    @Id
    private String id;
    private String userId;
    private String title;
    private String type; // strength, cardio, hiit, flexibility
    private int duration; // in minutes
    private int calories;
    private int exercises;
    private LocalDate date;
    private boolean completed;
    private String notes;
}

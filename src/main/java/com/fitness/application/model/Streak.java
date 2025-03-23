
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
@Document(collection = "streaks")
public class Streak {
    @Id
    private String id;
    private String userId;
    private int currentStreak;
    private int longestStreak;
    private LocalDate lastWorkoutDate;
}

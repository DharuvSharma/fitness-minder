
package com.fitness.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StreakDto {
    private int currentStreak;
    private int longestStreak;
    private String lastWorkoutDate;
}

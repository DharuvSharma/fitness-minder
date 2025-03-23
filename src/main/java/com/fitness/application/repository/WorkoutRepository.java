
package com.fitness.application.repository;

import com.fitness.application.model.Workout;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WorkoutRepository extends MongoRepository<Workout, String> {
    List<Workout> findByUserId(String userId);
    List<Workout> findByUserIdOrderByDateDesc(String userId);
    List<Workout> findByUserIdAndDateBetween(String userId, LocalDate start, LocalDate end);
    void deleteByIdAndUserId(String id, String userId);
}

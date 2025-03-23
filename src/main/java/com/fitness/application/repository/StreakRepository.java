
package com.fitness.application.repository;

import com.fitness.application.model.Streak;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StreakRepository extends MongoRepository<Streak, String> {
    Optional<Streak> findByUserId(String userId);
}


package com.fitness.application.repository;

import com.fitness.application.model.Goal;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoalRepository extends MongoRepository<Goal, String> {
    List<Goal> findByUserId(String userId);
    List<Goal> findByUserIdAndStatus(String userId, String status);
    void deleteByIdAndUserId(String id, String userId);
}

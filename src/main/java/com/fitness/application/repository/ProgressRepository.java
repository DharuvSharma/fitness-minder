
package com.fitness.application.repository;

import com.fitness.application.model.Progress;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProgressRepository extends MongoRepository<Progress, String> {
    List<Progress> findByUserIdAndCategory(String userId, String category);
    List<Progress> findByUserIdAndCategoryOrderByDateDesc(String userId, String category);
    List<Progress> findByUserIdAndCategoryAndDateBetween(String userId, String category, LocalDate start, LocalDate end);
}

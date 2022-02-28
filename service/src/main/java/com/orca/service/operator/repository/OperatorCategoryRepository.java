package com.orca.service.operator.repository;

import com.orca.service.operator.model.OperatorCategory;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface OperatorCategoryRepository extends JpaRepository<OperatorCategory, Integer> {
    Optional<OperatorCategory> findByCategory(@NotNull String category);
}

package com.orca.service.operator.repository;

import com.orca.service.operator.model.Operator;
import com.orca.service.operator.model.OperatorCategory;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OperatorRepository extends JpaRepository<Operator, Integer> {
    List<Operator> findAllByCategory(@NotNull OperatorCategory category);
    Operator findByName(String name);
}

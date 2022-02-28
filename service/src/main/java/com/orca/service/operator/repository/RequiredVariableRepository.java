package com.orca.service.operator.repository;

import com.orca.service.operator.model.Operator;
import com.orca.service.operator.model.RequiredOperatorVariable;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequiredVariableRepository extends JpaRepository<RequiredOperatorVariable, Integer> {
    List<RequiredOperatorVariable> findAllByOperator(@NotNull Operator operator);
}

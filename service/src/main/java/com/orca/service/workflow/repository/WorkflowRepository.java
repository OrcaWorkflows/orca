package com.orca.service.workflow.repository;

import com.orca.service.workflow.model.Workflow;
import org.jetbrains.annotations.NotNull;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface WorkflowRepository extends PagingAndSortingRepository<Workflow, Integer> {

    @NotNull
    Page<Workflow> findAllByUserId(Integer userId, Pageable pageable);

    Workflow findByName(String workflowName);

    @NotNull
    <S extends Workflow> S saveAndFlush(@NotNull S s);

    boolean existsById(@NotNull Integer id);

}

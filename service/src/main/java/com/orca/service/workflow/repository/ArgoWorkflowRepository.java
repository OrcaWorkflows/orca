package com.orca.service.workflow.repository;

import com.orca.service.workflow.model.ArgoWorkflow;
import com.orca.service.workflow.model.Workflow;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ArgoWorkflowRepository extends JpaRepository<ArgoWorkflow, Integer> {
    List<ArgoWorkflow> findByWorkflowOrderByDateDesc(@NotNull Workflow workflow);

}

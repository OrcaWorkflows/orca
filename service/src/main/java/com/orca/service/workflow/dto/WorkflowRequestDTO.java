package com.orca.service.workflow.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.jetbrains.annotations.NotNull;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class WorkflowRequestDTO {
    @NotNull
    private String name;

    private List<WorkflowTaskDTO> tasks;

    private Integer workflowID;

    public WorkflowRequestDTO(@NotNull String name, Integer workflowID) {
        this.name = name;
        this.workflowID = workflowID;
    }
}

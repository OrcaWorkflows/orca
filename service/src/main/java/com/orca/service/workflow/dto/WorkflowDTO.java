package com.orca.service.workflow.dto;

import com.orca.service.workflow.model.Workflow;
import com.sun.istack.Nullable;
import lombok.*;


import java.util.Date;
import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class WorkflowDTO {
    @Nullable
    private Integer id;
    private Map<String, Object> property;
    @Nullable
    private Date updatedAt;
    @Nullable
    private Date createdAt;
    @Nullable
    private String name;
    @Nullable
    private String argoWorkflowName;
    @Nullable
    private Boolean submitted;

    public static Workflow toModel(WorkflowDTO workflowDTO) {
        return new Workflow(
                workflowDTO.id,
                workflowDTO.property,
                workflowDTO.updatedAt,
                workflowDTO.createdAt,
                workflowDTO.name,
                workflowDTO.submitted
        );
    }
}

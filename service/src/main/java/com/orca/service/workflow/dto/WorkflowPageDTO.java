package com.orca.service.workflow.dto;

import com.sun.istack.Nullable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class WorkflowPageDTO {

    private List<WorkflowDTO> workflows;

    @Nullable
    private  Long totalCount;
}

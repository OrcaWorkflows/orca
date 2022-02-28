package com.orca.service.workflow.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;

import java.util.List;
import java.util.Map;
import java.util.Set;


@AllArgsConstructor
@NoArgsConstructor
@Getter
public class WorkflowTaskDTO {
    @NotNull
    private String name;

    private List<String> dependencies;

    private Map<String, String> templateRef;

    private Map<String, Set<Map<String, String>>> arguments;
}

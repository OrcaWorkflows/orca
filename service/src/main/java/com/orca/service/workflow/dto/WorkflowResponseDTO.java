package com.orca.service.workflow.dto;

import lombok.*;
import org.json.JSONObject;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class WorkflowResponseDTO {
    JSONObject workflows;
}

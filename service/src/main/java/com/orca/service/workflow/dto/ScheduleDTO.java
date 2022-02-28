package com.orca.service.workflow.dto;

import com.orca.service.workflow.model.Schedule;
import com.orca.service.workflow.model.Workflow;
import lombok.*;
import org.jetbrains.annotations.Nullable;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class ScheduleDTO {
    private Integer id;

    private String cronExpression;

    private Boolean suspend;

    private String timezone;
    @Nullable
    private Integer startingDeadlineSeconds;
    @Nullable
    private Integer successfulHistoryLimit;
    @Nullable
    private Date createdAt;
    @Nullable
    private String argoCronWorkflowName;

    private WorkflowRequestDTO workflow;


    public Schedule toModel(Workflow workflow) {
        return new Schedule(
                this.id,
                workflow,
                this.cronExpression,
                this.suspend,
                this.timezone,
                this.startingDeadlineSeconds,
                this.successfulHistoryLimit,
                this.createdAt,
                this.argoCronWorkflowName
        );
    }
}

package com.orca.service.workflow.model;

import com.orca.service.workflow.dto.ScheduleDTO;
import com.orca.service.workflow.dto.WorkflowRequestDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Entity
@Table(name = "schedule", schema = "public")
@AllArgsConstructor
@Setter
@Getter
@Log4j2
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    @ManyToOne
    private Workflow workflow;

    @Column(name = "cron_expression")
    private String cronExpression;

    @Column(name = "suspended")
    private Boolean suspended;

    @Column(name = "timezone")
    private String timezone;

    @Column(name = "starting_deadline_seconds", columnDefinition = "integer default 0")
    private Integer startingDeadlineSeconds;

    @Column(name = "successful_history_limit", columnDefinition = "integer default 3")
    private Integer successfulHistoryLimit;

    @Column(name = "created_at")
    private Date createdAt;

    @Column(name = "argo_cron_workflow_name")
    private String argoCronWorkflowName;

    public Schedule() {
        this.startingDeadlineSeconds = 0;
        this.successfulHistoryLimit = 3;
    }

    public ScheduleDTO toDTO() {
        return ScheduleDTO.builder()
                .id(id)
                .cronExpression(cronExpression)
                .suspend(suspended)
                .timezone(timezone)
                .startingDeadlineSeconds(startingDeadlineSeconds)
                .successfulHistoryLimit(successfulHistoryLimit)
                .createdAt(createdAt)
                .argoCronWorkflowName(argoCronWorkflowName)
                .workflow(new WorkflowRequestDTO(workflow.getName(), workflow.getId()))
                .build();
    }
}

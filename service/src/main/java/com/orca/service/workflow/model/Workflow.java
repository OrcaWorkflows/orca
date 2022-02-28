package com.orca.service.workflow.model;

import com.orca.service.workflow.dto.WorkflowDTO;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "workflow", schema = "public")
@TypeDef(name = "jsonb", typeClass = JsonBinaryType.class)
@NoArgsConstructor
@Setter
@Getter
@Log4j2
public class Workflow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Type(type = "jsonb")
    @Column(columnDefinition = "jsonb", name = "property", nullable = false)
    @NotNull(message = "property can not be null!")
    private Map<String, Object> property;

    @NotNull
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "updated_at")
    private Date updatedAt;
    @Column(name = "created_at")
    private Date createdAt;
    @Column(name = "name")
    private String name;
    @Column(name = "submitted")
    private Boolean submitted;

    @OneToMany(mappedBy = "workflow", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ArgoWorkflow> argoWorkflows;

    public Workflow(Integer id, Map<String, Object> property, Date updatedAt, Date createdAt, String name, Boolean submitted) {
        this.id = id;
        this.property = property;
        this.updatedAt = updatedAt;
        this.createdAt = createdAt;
        this.name = name;
        this.submitted = submitted;
    }

    public static WorkflowDTO toDTO(Workflow workflow, String argoWorkflowName) {
        return new WorkflowDTO(workflow.id, workflow.property, workflow.updatedAt, workflow.createdAt, workflow.name, argoWorkflowName, workflow.submitted);
    }
}

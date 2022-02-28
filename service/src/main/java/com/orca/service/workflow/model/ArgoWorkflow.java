package com.orca.service.workflow.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;


@Entity
@Table(name = "argo_workflow", schema = "public")
@NoArgsConstructor
@Setter
@Getter
@Log4j2
public class ArgoWorkflow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    @ManyToOne
    private Workflow workflow;

    @Column(name = "argo_name")
    private String argoName;

    @Column(name = "date")
    private Date date;

    public ArgoWorkflow(Workflow workflow, String argoName, Date date) {
        this.setWorkflow(workflow);
        this.setArgoName(argoName);
        this.setDate(date);
    }

}

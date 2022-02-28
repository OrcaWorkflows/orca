package com.orca.service.operator.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;

import javax.persistence.*;

@Entity
@Table(name = "required_operator_variables", schema = "public")
@NoArgsConstructor
@Setter
@Getter
@Log4j2
public class RequiredOperatorVariable {
    @Id
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "default")
    private String defaultValue;

    @ManyToOne
    @JoinColumn(name = "operator_id", nullable = false)
    private Operator operator;
}

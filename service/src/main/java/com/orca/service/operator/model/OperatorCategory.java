package com.orca.service.operator.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "operator_category", schema = "public")
@NoArgsConstructor
@Setter
@Getter
@Log4j2
public class OperatorCategory {
    @Id
    private Integer id;

    @Column(name = "category", nullable = false)
    private String category;

    @OneToMany(mappedBy = "category")
    private Set<Operator> operators;

}

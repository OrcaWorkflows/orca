package com.orca.service.operator.model;

import com.orca.service.operator.dto.OperatorDTO;
import com.orca.service.system.model.SystemConfig;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;

import javax.persistence.*;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "operator", schema = "public")
@NoArgsConstructor
@Setter
@Getter
@Log4j2
public class Operator {
    @Id
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private OperatorCategory category;

    @Column(name = "label")
    private String label;

    @OneToMany(mappedBy = "operator")
    private Set<RequiredOperatorVariable> requiredOperatorVariables;

    @OneToMany(mappedBy = "operator")
    private List<SystemConfig> systemConfigs;

    public OperatorDTO toDTO() {
        return new OperatorDTO(
                this.name,
                this.category.getCategory()
        );
    }
}

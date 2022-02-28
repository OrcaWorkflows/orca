package com.orca.service.system.model;

import com.orca.service.operator.model.Operator;
import com.orca.service.system.dto.HostDTO;
import com.orca.service.system.dto.SystemConfigDTO;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.jetbrains.annotations.NotNull;

import javax.persistence.*;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Entity
@Table(name = "system_config", schema = "public")
@TypeDef(name = "jsonb", typeClass = JsonBinaryType.class)
@NoArgsConstructor
@Setter
@Getter
@Log4j2
public class SystemConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    @Column(name = "name")
    private String name;

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;

    @Type(type = "jsonb")
    @Column(columnDefinition = "jsonb", name = "property")
    private Map<String, Object> property;

    @NotNull
    @ManyToOne
    private Operator operator;

    @OneToMany(mappedBy = "systemConfig", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Host> hostList;

    @Column(name = "updated_at")
    private Date updatedAt;

    @Column(name = "created_at")
    private Date createdAt;

    @NotNull
    @Column(name = "user_id")
    private Integer userId;

    public SystemConfigDTO toDTO() {
        List<HostDTO> hostDTOS = this.hostList.stream().map(Host::toDTO).collect(Collectors.toList());
        return SystemConfigDTO.builder()
                .id(this.id)
                .name(this.name)
                .username(this.username)
                .password(this.password)
                .property(this.property)
                .operatorName(this.operator.getName())
                .hostList(hostDTOS)
                .updatedAt(this.updatedAt)
                .createdAt(this.createdAt)
                .build();
    }
}

package com.orca.service.system.model;

import com.orca.service.system.dto.HostDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.jetbrains.annotations.NotNull;

import javax.persistence.*;

@Entity
@Table(name = "host", schema = "public")
@NoArgsConstructor
@Setter
@Getter
@Log4j2
public class Host {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    @Column(name = "host")
    private String host;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "system_config_id", nullable=false)
    private SystemConfig systemConfig;

    public Host(@NotNull String host) {
        this.host = host;
    }

    public Host(@NotNull String host, @NotNull SystemConfig systemConfig) {
        this.host = host;
        this.systemConfig = systemConfig;
    }

    public HostDTO toDTO() {
        return new HostDTO(this.id, this.host);
    }
}

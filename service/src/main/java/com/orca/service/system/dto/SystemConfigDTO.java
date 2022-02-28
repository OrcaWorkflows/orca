package com.orca.service.system.dto;

import lombok.*;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.util.Date;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class SystemConfigDTO {
    private Integer id;
    @NotNull
    private String name;
    @Nullable
    private String username;
    @Nullable
    private String password;
    @Nullable
    private Map<String, Object> property;

    @NotNull
    private String operatorName;
    @NotNull
    private List<HostDTO> hostList;

    private Date updatedAt;
    private Date createdAt;

}

package com.orca.service.system.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class HostDTO {
    @Nullable
    private Integer id;
    @NotNull
    private String host;
}

package com.orca.service.operator.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jetbrains.annotations.NotNull;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OperatorDTO {
    @NotNull
    private String name;

    @NotNull
    private String categoryName;


}

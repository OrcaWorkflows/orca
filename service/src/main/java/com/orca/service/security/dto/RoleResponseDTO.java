package com.orca.service.security.dto;

import io.swagger.annotations.ApiModelProperty;

import java.util.Objects;

public class RoleResponseDTO {

    @ApiModelProperty(position = 1)
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null) return false;
        if (!(obj instanceof RoleResponseDTO)) return false;
        RoleResponseDTO other = (RoleResponseDTO) obj;
        return Objects.equals(this.name, other.getName());
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }
}
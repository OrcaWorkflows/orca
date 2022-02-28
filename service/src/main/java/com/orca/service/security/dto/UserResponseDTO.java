package com.orca.service.security.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.Objects;

@Getter
@Setter
public class UserResponseDTO {

    @ApiModelProperty(position = 1)
    private String username;
    @ApiModelProperty(position = 2)
    private String email;
    @ApiModelProperty(position = 3)
    private String organizationName;
    @ApiModelProperty(position = 4)
    private Date createdAt;
    @ApiModelProperty(position = 5)
    private Date updatedAt;

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null) return false;
        if (!(obj instanceof UserResponseDTO)) return false;
        UserResponseDTO other = (UserResponseDTO) obj;
        return Objects.equals(this.username, other.getUsername()) && Objects.equals(this.email, other.getEmail());
    }

    @Override
    public int hashCode() {
        return Objects.hash(username);
    }
}
package com.orca.service.security.dto;

import io.swagger.annotations.ApiModelProperty;

public class LoginSuccessfulDTO {

    @ApiModelProperty(position = 0)
    private String key;

    public String getKey() {
        return key;
    }

    public LoginSuccessfulDTO setKey(String key) {
        this.key = key;
        return this;
    }


}

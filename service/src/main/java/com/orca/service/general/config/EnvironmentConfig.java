package com.orca.service.general.config;

import lombok.Getter;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;


@Configuration
@Getter
@Log4j2
public class EnvironmentConfig {
    @Value("${ARGO_URL:http://localhost}")
    public String argoUrl;
}

package com.orca.service.general.config;

import lombok.extern.log4j.Log4j2;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.hateoas.client.LinkDiscoverer;
import org.springframework.hateoas.client.LinkDiscoverers;
import org.springframework.hateoas.mediatype.collectionjson.CollectionJsonLinkDiscoverer;
import org.springframework.plugin.core.SimplePluginRegistry;

import javax.sql.DataSource;
import java.util.ArrayList;
import java.util.List;


@Configuration
@Log4j2
public class SytemConfigBean {

    @Bean
    public DataSource dataSource() {
        String postgresHost = System.getenv("POSTGRES_HOST");
        String postgresUsername = System.getenv("POSTGRES_USERNAME");
        String postgresPassword = System.getenv("POSTGRES_PASS");
        log.info("POSTGRES_HOST is set to " + postgresHost);
        log.info("POSTGRES_USERNAME is set to " + postgresUsername);
        return DataSourceBuilder
                .create()
                .username(postgresUsername)
                .password(postgresPassword)
                .url("jdbc:postgresql://" + postgresHost + "/postgres")
                .driverClassName("org.postgresql.Driver")
                .build();
    }

    @Bean
    public LinkDiscoverers discoverers() {
        List<LinkDiscoverer> plugins = new ArrayList<>();
        plugins.add(new CollectionJsonLinkDiscoverer());
        return new LinkDiscoverers(SimplePluginRegistry.create(plugins));
    }
}

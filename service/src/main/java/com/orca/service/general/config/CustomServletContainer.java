package com.orca.service.general.config;


import org.apache.catalina.connector.Connector;
import org.apache.coyote.http11.Http11NioProtocol;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.embedded.tomcat.TomcatConnectorCustomizer;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.io.File;

@Component
@Profile("prod")
public class CustomServletContainer implements
        WebServerFactoryCustomizer<TomcatServletWebServerFactory> {

    @Value("${key-store}")
    private String keystoreFile;
    @Value("${key-alias}")
    private String keystoreAlias;
    @Value("${key-store-type}")
    private String keystoreType;
    @Value("${key-password}")
    private String keystorePass;
    @Value("${port}")
    private int tlsPort;

    public void customize(TomcatServletWebServerFactory factory) {

        factory.addConnectorCustomizers(new TomcatConnectorCustomizer() {

            @Override
            public void customize(Connector connector) {

                connector.setPort(8080);
                connector.setSecure(true);
                connector.setScheme("https");
                connector.setAttribute("keyAlias", "tomcat");
                connector.setAttribute("keystorePass", keystorePass);

                File file = new File(keystoreFile);
                String absoluteKeystoreFile = file.getAbsolutePath();

                connector.setAttribute("keystoreFile", absoluteKeystoreFile);
                connector.setAttribute("clientAuth", "true");
                connector.setAttribute("sslProtocol", "TLS");
                connector.setAttribute("SSLEnabled", true);

                Http11NioProtocol proto = (Http11NioProtocol) connector.getProtocolHandler();

                proto.setSSLEnabled(true);
                proto.setKeystoreFile(keystoreFile);
                proto.setKeystorePass(keystorePass);
                proto.setKeystoreType(keystoreType);
                proto.setKeyAlias(keystoreAlias);
            }
        });
    }

}
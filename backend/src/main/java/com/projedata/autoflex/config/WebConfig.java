package com.projedata.autoflex.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final CorsProperties corsProperties;

    public WebConfig(CorsProperties corsProperties) {
        this.corsProperties = corsProperties;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String[] allowedOrigins = (corsProperties.getAllowedOrigins() == null || corsProperties.getAllowedOrigins().isEmpty())
            ? new String[] { "http://localhost:5173" }
            : corsProperties.getAllowedOrigins().toArray(new String[0]);

        registry.addMapping("/**")
            .allowedOrigins(allowedOrigins)
            .allowedMethods("GET", "POST", "DELETE", "PATCH", "PUT", "OPTIONS")
            .allowedHeaders("*");
    }
}

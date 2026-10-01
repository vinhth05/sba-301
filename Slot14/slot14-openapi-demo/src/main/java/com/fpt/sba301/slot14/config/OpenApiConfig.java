package com.fpt.sba301.slot14.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI funewsOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("FUNews Management API")
                        .version("1.0.0")
                        .description("Training API for SBA301 Slot 14 - Documenting REST Services with OpenAPI and Swagger")
                        .termsOfService("https://fpt.edu.vn/terms")
                        .contact(new Contact()
                                .name("Trần Hiển Vinh (CE190881)")
                                .email("vinhthe190881@fpt.edu.vn")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Local development server")
                ));
    }
}

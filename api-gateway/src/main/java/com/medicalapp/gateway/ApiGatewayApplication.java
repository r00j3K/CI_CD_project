package com.medicalapp.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            // 1. Serwis Użytkowników (Rejestracja i Logowanie)
            .route("user-service", r -> r.path("/api/auth/**")
                .uri("http://user-service:8081"))

            // 2. Serwis Wizyt (Lekarze i Sloty)
            .route("appointment-service", r -> r.path("/api/doctors/**", "/api/slots/**")
                .uri("http://appointment-service:8082"))

            // 3. Serwis Rezerwacji
            .route("booking-service", r -> r.path("/api/bookings/**")
                .uri("http://booking-service:8083"))
            
            .build();
    }
}
package com.medicalapp.appointmentservice.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/slots/health").permitAll()
                        .requestMatchers("/api/health").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/doctors/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/slots/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/doctors/**")
                        .hasAnyRole("ADMIN", "DOCTOR")
                        .requestMatchers(HttpMethod.POST, "/api/slots/*/available").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/slots/*/unavailable").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/slots/**")
                        .hasAnyRole("ADMIN", "DOCTOR")
                        .requestMatchers(HttpMethod.PATCH, "/api/slots/**")
                        .hasAnyRole("ADMIN", "DOCTOR")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
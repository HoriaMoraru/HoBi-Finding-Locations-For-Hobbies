package com.hobi.backend.config;

import com.hobi.backend.firebase.filter.FirebaseAuthenticationFilter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@Slf4j
public class SecurityConfig {

    private static final String BASE_API_PATH = "/api/**";
    private static final String REGISTER_ENDPOINT = "/api/register";

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // Apply security to all endpoints matching BASE_API_PATH
                .securityMatcher(BASE_API_PATH)
                .cors(AbstractHttpConfigurer::disable)
                .csrf(AbstractHttpConfigurer::disable)
                .addFilterAfter(new FirebaseAuthenticationFilter(), BasicAuthenticationFilter.class)
                .authorizeHttpRequests(authorizeRequests -> authorizeRequests
                        // Permit access to /api/register without authentication
                        .requestMatchers(REGISTER_ENDPOINT).permitAll()
                        // Require authentication for all other endpoints under BASE_API_PATH
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}
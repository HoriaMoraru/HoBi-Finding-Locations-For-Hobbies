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
    private static final String[] AUTHENTICATED_ENDPOINTS = {
        "/api/da"
    };
    private static final String[] PUBLIC_ENDPOINTS = {
            "/api/register"
    };
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.securityMatcher(BASE_API_PATH)
                .cors(AbstractHttpConfigurer::disable)
                .csrf(AbstractHttpConfigurer::disable)
                .addFilterAfter(new FirebaseAuthenticationFilter(), BasicAuthenticationFilter.class)
                .authorizeHttpRequests(authorizeRequests -> authorizeRequests
                        .requestMatchers(PUBLIC_ENDPOINTS).permitAll() // Allow public access to /login and /register
                        .requestMatchers(AUTHENTICATED_ENDPOINTS).authenticated() // Require authentication for other /api/** endpoints
                );

        return http.build();
    }

}
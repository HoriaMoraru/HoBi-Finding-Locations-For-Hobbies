package com.hobi.backend.firebase.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class FirebaseAuthenticationFilter extends OncePerRequestFilter {

//    @Value("${app.authorization.header}")
//    private String authorizationHeader;
    private static final String BEARER_PREFIX = "Bearer ";

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null || !authorizationHeader.startsWith(BEARER_PREFIX)) {
            // Skip authentication for requests without the Authorization header
            filterChain.doFilter(request, response);
            return;
        }

        final String idToken = request.getHeader(authorizationHeader);

        if (idToken == null || idToken.isEmpty()) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing Firebase ID-Token");
            return;
        }

        SecurityContextHolder.getContext().getAuthentication().setAuthenticated(true);

        filterChain.doFilter(request, response);
    }
}

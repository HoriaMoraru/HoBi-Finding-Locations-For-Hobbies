package com.hobi.backend.firebase.filter;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.hobi.backend.firebase.token.FirebaseAuthenticationToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
public class FirebaseAuthenticationFilter extends OncePerRequestFilter {
    private static final String BEARER_PREFIX = "Bearer ";
    private static final String INVALID_TOKEN_ERROR_MSG = "Invalid Firebase ID-Token";
    private static final String MISSING_TOKEN_ERROR_MSG = "Missing Firebase ID-Token";

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null || !authorizationHeader.startsWith(BEARER_PREFIX)) {
            // Skip authentication for requests without the Authorization header
            // For example, register
            filterChain.doFilter(request, response);
            return;
        }

        final String idToken = authorizationHeader.substring(BEARER_PREFIX.length());

        if (idToken.isEmpty()) {
            log.error(MISSING_TOKEN_ERROR_MSG);
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, MISSING_TOKEN_ERROR_MSG);
            return;
        }

        try {
            final FirebaseToken firebaseToken =
                    FirebaseAuth.getInstance().verifyIdToken(idToken);

            SecurityContextHolder.getContext()
                    .setAuthentication(
                            new FirebaseAuthenticationToken(firebaseToken, idToken)
                    );
            SecurityContextHolder.getContext().getAuthentication().setAuthenticated(true);

        } catch (FirebaseAuthException e) {
            log.error(INVALID_TOKEN_ERROR_MSG);
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, INVALID_TOKEN_ERROR_MSG);
            return;
        }

        filterChain.doFilter(request, response);
    }
}

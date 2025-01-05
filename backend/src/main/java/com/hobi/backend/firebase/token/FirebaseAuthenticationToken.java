package com.hobi.backend.firebase.token;

import com.google.firebase.auth.FirebaseToken;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.List;

public class FirebaseAuthenticationToken extends AbstractAuthenticationToken {

    private FirebaseToken firebaseToken;
    private String idToken;

    public FirebaseAuthenticationToken(FirebaseToken firebaseToken, String idToken) {
        super(null); // We do not need the authorities
        this.firebaseToken = firebaseToken;
        this.idToken = idToken;
    }

    public FirebaseAuthenticationToken(
            String idToken, FirebaseToken firebaseToken, List<GrantedAuthority> authorities) {
        super(authorities);
        this.idToken = idToken;
        this.firebaseToken = firebaseToken;
    }

    @Override
    public Object getCredentials() {
        return idToken;
    }

    @Override
    public Object getPrincipal() {
        return firebaseToken.getUid();
    }
}
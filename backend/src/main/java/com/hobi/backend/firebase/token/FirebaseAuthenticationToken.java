package com.hobi.backend.firebase.token;

import com.google.firebase.auth.FirebaseToken;
import org.springframework.security.authentication.AbstractAuthenticationToken;

import java.util.Objects;

public class FirebaseAuthenticationToken extends AbstractAuthenticationToken {

    private final FirebaseToken firebaseToken;
    private final String idToken;

    public FirebaseAuthenticationToken(FirebaseToken firebaseToken, String idToken) {
        super(null); // We do not need the authorities
        this.firebaseToken = firebaseToken;
        this.idToken = idToken;
    }

    @Override
    public Object getCredentials() {
        return idToken;
    }

    @Override
    public Object getPrincipal() {
        return firebaseToken.getUid();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        FirebaseAuthenticationToken that = (FirebaseAuthenticationToken) o;
        return Objects.equals(firebaseToken, that.firebaseToken) && Objects.equals(idToken, that.idToken);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), firebaseToken, idToken);
    }
}
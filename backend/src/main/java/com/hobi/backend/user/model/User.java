package com.hobi.backend.user.model;

import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class User {
    @DocumentId
    private String userId;
    private String email;
    private String password;
    private UserPreference userPreference;
}

package com.hobi.backend.model;

import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class User {
    @DocumentId
    private String userId;
    private String email;
    private UserPreference userPreference;
}

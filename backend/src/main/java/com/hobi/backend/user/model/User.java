package com.hobi.backend.user.model;

import com.google.cloud.firestore.annotation.DocumentId;
import com.hobi.backend.maps.model.Location;
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
    private Location realTimeLocation;
}

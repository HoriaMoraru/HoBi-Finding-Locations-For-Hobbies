package com.hobi.backend.controller;

import com.hobi.backend.firebase.service.FirebaseService;
import com.hobi.backend.request.CreateUserRequest;
import com.hobi.backend.user.model.UserPreference;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {
    private final FirebaseService firebaseService;

    @PostMapping("/register")
    public ResponseEntity<String> createUser(@RequestBody CreateUserRequest createUserRequest) {
        return ResponseEntity.ok(firebaseService.registerUser(createUserRequest));
    }

    @GetMapping("/displayUserPage")
    public ResponseEntity<UserPreference> displayUserPage(Authentication authentication) {
        // Ensure the request is authenticated
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Get the UID from the Authentication object
        String userId = authentication.getName();

        // Fetch user preferences from Firestore
        return firebaseService.getUserPreferences(userId)
                .map(ResponseEntity::ok) // If found, return 200 OK with the UserPreference
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build()); // Return 404 NOT FOUND if preferences are missing
    }
}

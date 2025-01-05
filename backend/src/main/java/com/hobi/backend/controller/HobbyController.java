package com.hobi.backend.controller;

import com.hobi.backend.firebase.service.FirebaseService;
import com.hobi.backend.request.UpdateHobbyRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class HobbyController {

    private final FirebaseService firebaseService;
    @PutMapping("/hobbies")
    public ResponseEntity<String> addHobby(
            Authentication authentication,
            @RequestBody UpdateHobbyRequest hobbyRequest) {
        // Ensure the user is authenticated
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        String userId = authentication.getName();
        boolean hobbyAdded = firebaseService.addHobby(userId, hobbyRequest);

        if (hobbyAdded) {
            return ResponseEntity.ok("Hobbies updated successfully.");
        } else {
            return ResponseEntity.badRequest().body("Failed to update hobbies.");
        }
    }

    @DeleteMapping("/hobbies")
    public ResponseEntity<String> removeHobby(Authentication authentication,
                                              @RequestBody UpdateHobbyRequest hobbyRequest) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        String userId = authentication.getName();
        boolean hobbyRemoved = firebaseService.removeHobby(userId, hobbyRequest);

        if (hobbyRemoved) {
            return ResponseEntity.ok("Hobby removed successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to remove hobby.");
        }
    }

    @GetMapping("/hobbies")
    public ResponseEntity<List<String>> displayHobbies(Authentication authentication) {
        // Ensure the request is authenticated
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Get the UID from the Authentication object
        String userId = authentication.getName();

        // Fetch user preferences from Firestore
        return firebaseService.getHobbies(userId)
                .map(ResponseEntity::ok) // If found, return 200 OK with the list of hobbies
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build()); // Return 404 NOT FOUND if preferences are missing
    }
}

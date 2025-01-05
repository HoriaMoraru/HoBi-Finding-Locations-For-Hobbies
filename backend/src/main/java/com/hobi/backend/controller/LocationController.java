package com.hobi.backend.controller;

import com.hobi.backend.maps.service.MapsService;
import com.hobi.backend.request.UpdateLocationRequest;
import com.hobi.backend.firebase.service.FirebaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController {

    private final FirebaseService firebaseService;
    private final MapsService mapsService;

    @PostMapping("/update")
    public ResponseEntity<String> updateUserLocation(
            Authentication authentication,
            @RequestBody UpdateLocationRequest locationRequest) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        String userId = authentication.getName();
        boolean updatedUserLocation = firebaseService.updateUserLocation(userId, locationRequest);

        if (updatedUserLocation) {
            return ResponseEntity.ok("Location updated successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update location.");
        }
    }

    @GetMapping("/fetch/{")
}

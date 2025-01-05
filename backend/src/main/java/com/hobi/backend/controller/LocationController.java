package com.hobi.backend.controller;

import com.hobi.backend.firebase.service.FirebaseService;
import com.hobi.backend.maps.model.Location;
import com.hobi.backend.maps.service.MapsService;
import com.hobi.backend.request.UpdateHobbyRequest;
import com.hobi.backend.request.UpdateLocationRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@Slf4j
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

        final String userId = authentication.getName();
        final boolean updatedUserLocation = firebaseService.updateUserLocation(userId, locationRequest);

        if (updatedUserLocation) {
            return ResponseEntity.ok("Location updated successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update location.");
        }
    }

    @GetMapping("/fetchLocatinos/{hobby}")
    public ResponseEntity<List<Location>> fetchLocationsByHobby(
            Authentication authentication,
            @PathVariable("hobby") String hobby) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        final String userId = authentication.getName();
        final Optional<Location> locationOpt = firebaseService.getUserRealTimeLocation(userId);
        if (locationOpt.isEmpty()) {
            log.error("User with ID: {} does not have an updated location.", userId); // Log error
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .build(); // 404 Not Found if location is missing
        }
        final Location userLocation = locationOpt.get();

        return ResponseEntity.ok(mapsService.fetchLocationsForHobby(userLocation, hobby));
    }
}

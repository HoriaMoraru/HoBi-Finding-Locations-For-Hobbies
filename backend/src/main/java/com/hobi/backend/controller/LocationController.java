package com.hobi.backend.controller;

import com.google.maps.model.DirectionsRoute;
import com.hobi.backend.firebase.service.FirebaseService;
import com.hobi.backend.maps.model.Location;
import com.hobi.backend.maps.model.NamedLocation;
import com.hobi.backend.maps.service.MapsService;
import com.hobi.backend.request.LocationRequest;
import com.hobi.backend.request.UpdateUserLocationRequest;
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
            @RequestBody LocationRequest locationRequest) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        log.info("Updating real time location!");

        final String userId = authentication.getName();
        final boolean updatedUserLocation = firebaseService.updateUserLocation(userId, locationRequest);

        if (updatedUserLocation) {
            return ResponseEntity.ok("Location updated successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update location.");
        }
    }

    @GetMapping("/fetchLocations/{hobby}")
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

    @GetMapping("/viewSaved/{hobby}")
    public ResponseEntity<List<NamedLocation>> viewSavedLocations(
            Authentication authentication,
            @PathVariable("hobby") String hobby) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        final String userId = authentication.getName();
        return firebaseService.getSavedLocations(userId, hobby)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping("/save/{hobby}")
    public ResponseEntity<String> addLocationToSaved(
            Authentication authentication,
            @RequestBody UpdateUserLocationRequest locationRequest,
            @PathVariable("hobby") String hobby) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        final String userId = authentication.getName();
        boolean isSaved = firebaseService.addLocationToSaved(userId, hobby, locationRequest);

        if (isSaved) {
            return ResponseEntity.ok("Location saved successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to save location.");
        }
    }

    @DeleteMapping("/remove/{hobby}")
    public ResponseEntity<String> removeLocationFromSaved(
            Authentication authentication,
            @RequestBody UpdateUserLocationRequest locationRequest,
            @PathVariable("hobby") String hobby) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        final String userId = authentication.getName();
        boolean isRemoved = firebaseService.removeLocationFromSaved(userId, hobby, locationRequest);

        if (isRemoved) {
            return ResponseEntity.ok("Location removed successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to remove location.");
        }
    }

    @GetMapping("/route")
    public ResponseEntity<DirectionsRoute> getRoute(
            Authentication authentication,
            @RequestBody LocationRequest locationRequest) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        final String userId = authentication.getName();

        Optional<Location> userLocationOpt = firebaseService.getUserRealTimeLocation(userId);
        if (userLocationOpt.isEmpty()) {
            log.error("User with ID: {} does not have an updated location.", userId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Location userLocation = userLocationOpt.get();
        Location destination = locationRequest.getLocation();

        return mapsService.getRoute(userLocation, destination)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}

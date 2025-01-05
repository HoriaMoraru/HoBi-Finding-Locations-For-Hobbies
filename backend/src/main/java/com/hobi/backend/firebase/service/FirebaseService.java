package com.hobi.backend.firebase.service;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.cloud.FirestoreClient;
import com.hobi.backend.maps.model.NamedLocation;
import com.hobi.backend.request.CreateUserRequest;
import com.hobi.backend.request.UpdateHobbyRequest;
import com.hobi.backend.request.LocationRequest;
import com.hobi.backend.maps.model.Location;
import com.hobi.backend.request.UpdateUserLocationRequest;
import com.hobi.backend.user.model.User;
import com.hobi.backend.user.model.UserPreference;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Service
@Slf4j
public class FirebaseService {
    private static final String COLLECTION_NAME = "users";
    private static final String USER_REGISTERED_MSG = "User registered successfully with ID: ";
    private static final String USER_REGISTERED_ERROR_MSG = "Error registering user: ";
    private static final String INTERRUPTED_REQUEST_ERROR_MSG =
            "Error: The request was interrupted. Please try again.";
    private static final String DATABASE_INTERNAL_ERROR_MSG =
            "Error: Unable to save the user due to a database error. Details: ";
    private static final String USER_NOT_FOUND_ERROR_MSG = "User not found with ID: ";
    // USERS
    public String registerUser(CreateUserRequest createUserRequest) {
        try {
            // Create user in Firebase Authentication
            UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                    .setEmail(createUserRequest.getEmail())
                    .setPassword(createUserRequest.getPassword());
            UserRecord userRecord = FirebaseAuth.getInstance().createUser(request);

            // Save additional details (e.g., preferences) in Firestore
            Firestore db = FirestoreClient.getFirestore();

            User user = new User();
            user.setUserId(userRecord.getUid());
            user.setEmail(createUserRequest.getEmail());
            user.setPassword(createUserRequest.getPassword()); // You may want to hash this
            user.setUserPreference(new UserPreference()); // Placeholder for future preferences
            user.setRealTimeLocation(new Location()); // This will get updated by front-end

            db.collection(COLLECTION_NAME).document(userRecord.getUid()).set(user).get();

            log.info(USER_REGISTERED_MSG + userRecord.getUid());

            return USER_REGISTERED_MSG + userRecord.getUid();
        } catch (FirebaseAuthException e) {
            log.error(USER_REGISTERED_ERROR_MSG + e.getMessage(), e);
            return USER_REGISTERED_ERROR_MSG + e.getMessage();
        } catch (InterruptedException e) {
            log.error(INTERRUPTED_REQUEST_ERROR_MSG);
            Thread.currentThread().interrupt();
            return INTERRUPTED_REQUEST_ERROR_MSG;
        } catch (ExecutionException e) {
            log.error(DATABASE_INTERNAL_ERROR_MSG + e.getMessage());
            return DATABASE_INTERNAL_ERROR_MSG + e.getMessage();
        }
    }
    // END OF USERS
    // HOBBIES
    public boolean addHobby(String userId, UpdateHobbyRequest hobbyRequest) {
        final String hobby = hobbyRequest.getHobby();
        try {
            Firestore db = FirestoreClient.getFirestore();

            DocumentSnapshot document = db.collection(COLLECTION_NAME).document(userId).get().get();
            if (!document.exists()) {
                log.error(USER_NOT_FOUND_ERROR_MSG + userId);
                return false;
            }

            User user = document.toObject(User.class);
            if (user == null) {
                log.error("Failed to map user document to User object for ID: " + userId);
                return false;
            }

            UserPreference userPreference = user.getUserPreference();
            if (userPreference == null) {
                userPreference = new UserPreference();
                user.setUserPreference(userPreference);
            }

            if (!userPreference.getHobbies().contains(hobby)) {
                userPreference.getHobbies().add(hobby);
            } else {
                log.info("Hobby already exists for user: " + userId);
            }

            db.collection(COLLECTION_NAME).document(userId).set(user).get();
            log.info("Hobby added successfully for user: " + userId);
            return true;

        } catch (InterruptedException e) {
            log.error(INTERRUPTED_REQUEST_ERROR_MSG);
            Thread.currentThread().interrupt();
            return false;
        } catch (ExecutionException e) {
            log.error(DATABASE_INTERNAL_ERROR_MSG + e.getMessage());
            return false;
        }
    }

    public boolean removeHobby(String userId, UpdateHobbyRequest hobbyRequest) {
        final String hobby = hobbyRequest.getHobby();
        try {
            Firestore db = FirestoreClient.getFirestore();

            DocumentSnapshot document = db.collection(COLLECTION_NAME).document(userId).get().get();
            if (!document.exists()) {
                log.error(USER_NOT_FOUND_ERROR_MSG + userId);
                return false;
            }

            User user = document.toObject(User.class);
            if (user == null) {
                log.error("Failed to map user document to User object for ID: " + userId);
                return false;
            }

            UserPreference userPreference = user.getUserPreference();
            if (userPreference != null && userPreference.getHobbies().contains(hobby)) {
                userPreference.getHobbies().remove(hobby);
            } else {
                log.info("Hobby not found for user: " + userId);
            }

            db.collection(COLLECTION_NAME).document(userId).set(user).get();
            log.info("Hobby removed successfully for user: " + userId);
            return true;

        } catch (InterruptedException e) {
            log.error(INTERRUPTED_REQUEST_ERROR_MSG);
            Thread.currentThread().interrupt();
            return false;
        } catch (ExecutionException e) {
            log.error(DATABASE_INTERNAL_ERROR_MSG + e.getMessage());
            return false;
        }
    }

    public Optional<List<String>> getHobbies(String userId) {
        try {
            Firestore db = FirestoreClient.getFirestore();

            // Fetch the user document
            DocumentSnapshot document = db.collection(COLLECTION_NAME).document(userId).get().get();
            if (!document.exists()) {
                log.error(USER_NOT_FOUND_ERROR_MSG + userId);
                return Optional.empty();
            }

            // Map to User object
            User user = document.toObject(User.class);
            if (user == null || user.getUserPreference() == null) {
                log.error("Failed to retrieve user preferences for ID: " + userId);
                return Optional.empty();
            }

            // Return the hobbies list
            return Optional.ofNullable(user.getUserPreference().getHobbies());

        } catch (InterruptedException e) {
            log.error(INTERRUPTED_REQUEST_ERROR_MSG);
            Thread.currentThread().interrupt();
            return Optional.empty();
        } catch (ExecutionException e) {
            log.error(DATABASE_INTERNAL_ERROR_MSG + e.getMessage());
            return Optional.empty();
        }
    }
    // END OF HOBBIES
    // LOCATION
    public boolean updateUserLocation(String userId, LocationRequest locationRequest) {
        final Location currentUserLocation = locationRequest.getLocation();
        try {
            Firestore db = FirestoreClient.getFirestore();

            // Fetch the user document
            DocumentSnapshot document = db.collection(COLLECTION_NAME).document(userId).get().get();
            if (!document.exists()) {
                log.error(USER_NOT_FOUND_ERROR_MSG + userId);
                return false;
            }

            User user = document.toObject(User.class);
            if (user == null) {
                log.error("Failed to map user document for ID: " + userId);
                return false;
            }

            // Update the user's location
            user.setRealTimeLocation(currentUserLocation);
            db.collection(COLLECTION_NAME).document(userId).set(user).get();

            log.info("Location updated for user: " + userId);
            return true;

        } catch (InterruptedException e) {
            log.error(INTERRUPTED_REQUEST_ERROR_MSG);
            Thread.currentThread().interrupt();
            return false;
        } catch (ExecutionException e) {
            log.error(DATABASE_INTERNAL_ERROR_MSG + e.getMessage());
            return false;
        }
    }

    public Optional<Location> getUserRealTimeLocation(String userId) {
        try {
            Firestore db = FirestoreClient.getFirestore();

            // Fetch the user document
            DocumentSnapshot document = db.collection(COLLECTION_NAME).document(userId).get().get();
            if (!document.exists()) {
                log.error(USER_NOT_FOUND_ERROR_MSG + userId);
                return Optional.empty();
            }

            // Map to User object
            User user = document.toObject(User.class);
            if (user == null || user.getRealTimeLocation() == null) {
                log.error("Failed to retrieve location for user ID: " + userId);
                return Optional.empty();
            }

            // Return the user's location
            return Optional.of(user.getRealTimeLocation());

        } catch (InterruptedException e) {
            log.error(INTERRUPTED_REQUEST_ERROR_MSG);
            Thread.currentThread().interrupt();
            return Optional.empty();
        } catch (ExecutionException e) {
            log.error(DATABASE_INTERNAL_ERROR_MSG + e.getMessage());
            return Optional.empty();
        }
    }

    public boolean saveUserLocation(String userId, UpdateUserLocationRequest locationRequest) {
        final NamedLocation location = locationRequest.getLocation();
        try {
            Firestore db = FirestoreClient.getFirestore();

            // Fetch user document
            DocumentSnapshot document = db.collection(COLLECTION_NAME).document(userId).get().get();
            if (!document.exists()) {
                log.error("User not found with ID: {}", userId);
                return false;
            }

            // Map to User object
            User user = document.toObject(User.class);
            if (user == null) {
                log.error("Failed to map user document for ID: {}", userId);
                return false;
            }

            // Add location to savedLocations
            UserPreference userPreference = user.getUserPreference();
            if (userPreference == null) {
                userPreference = new UserPreference();
                user.setUserPreference(userPreference);
            }

            userPreference.getSavedLocations().add(new NamedLocation(
                    location.getLatitude(),
                    location.getLongitude(),
                    location.getName()
            ));

            // Save updated user back to Firestore
            db.collection(COLLECTION_NAME).document(userId).set(user).get();
            log.info("Location saved successfully for user: {}", userId);
            return true;

        } catch (InterruptedException e) {
            log.error(INTERRUPTED_REQUEST_ERROR_MSG);
            Thread.currentThread().interrupt();
            return false;
        } catch (ExecutionException e) {
            log.error(DATABASE_INTERNAL_ERROR_MSG + e.getMessage());
            return false;
        }
    }

    public boolean removeUserLocation(String userId, UpdateUserLocationRequest locationRequest) {
        final NamedLocation location = locationRequest.getLocation();
        try {
            Firestore db = FirestoreClient.getFirestore();

            // Fetch user document
            DocumentSnapshot document = db.collection(COLLECTION_NAME).document(userId).get().get();
            if (!document.exists()) {
                log.error("User not found with ID: {}", userId);
                return false;
            }

            // Map to User object
            User user = document.toObject(User.class);
            if (user == null) {
                log.error("Failed to map user document for ID: {}", userId);
                return false;
            }

            // Remove location from savedLocations
            UserPreference userPreference = user.getUserPreference();
            if (userPreference != null) {
                userPreference.getSavedLocations().removeIf(
                        savedLocation -> savedLocation.equals(location)
                );
            }

            // Save updated user back to Firestore
            db.collection(COLLECTION_NAME).document(userId).set(user).get();
            log.info("Location removed successfully for user: {}", userId);
            return true;

        } catch (InterruptedException e) {
            log.error(INTERRUPTED_REQUEST_ERROR_MSG);
            Thread.currentThread().interrupt();
            return false;
        } catch (ExecutionException e) {
            log.error(DATABASE_INTERNAL_ERROR_MSG + e.getMessage());
            return false;
        }
    }
    // END OF LOCATION
}

package com.hobi.backend.firebase.service;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.cloud.FirestoreClient;
import com.hobi.backend.request.CreateUserRequest;
import com.hobi.backend.user.model.User;
import com.hobi.backend.user.model.UserPreference;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.concurrent.CancellationException;
import java.util.concurrent.ExecutionException;

@Service
@Slf4j
public class FirebaseService {
    private static final String COLLECTION_NAME = "users";
    private static final String USER_REGISTERED_MSG = "User registered successfully with ID: ";
    private static final String USER_REGISTERED_ERROR_MSG = "Error registering user: ";
    private static final String INTERRUPTED_REQUEST_ERROR_MSG =
            "Error: The request was interrupted. Please try again.";
    private static final String COMPUTATION_CANCELED_EXCEPTION =
            "Error: The computation was canceled: ";
    private static final String DATABASE_INTERNAL_ERROR_MSG =
            "Error: Unable to save the user due to a database error. Details: ";

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

    public Optional<UserPreference> getUserPreferences(String userId) {
        try {
            Firestore db = FirestoreClient.getFirestore();
            DocumentSnapshot document = db.collection(COLLECTION_NAME).document(userId).get().get();
            if (document.exists()) {
                return Optional.ofNullable(document.toObject(UserPreference.class));
            }
        } catch (CancellationException e) {
            log.error(COMPUTATION_CANCELED_EXCEPTION + e.getMessage());
            return Optional.empty();
        } catch (InterruptedException e) {
            log.error(INTERRUPTED_REQUEST_ERROR_MSG);
            Thread.currentThread().interrupt();
            return Optional.empty();
        } catch (ExecutionException e) {
            log.error(DATABASE_INTERNAL_ERROR_MSG + e.getMessage());
            return Optional.empty();
        }
        return Optional.empty();
    }
}

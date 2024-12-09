package com.hobi.backend.firebase.service;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import com.hobi.backend.model.User;
import org.springframework.stereotype.Service;

@Service
public class FirebaseService {
    private static final String USER_ADDED_MSG = "User added to database.";
    private static final String COLLECTION_NAME = "users";

    public String saveUser(User user) {
        Firestore db = FirestoreClient.getFirestore();
        db.collection(COLLECTION_NAME).document(user.getUserId()).set(user);
        return USER_ADDED_MSG;
    }
}

package com.hobi.backend.controller;

import com.hobi.backend.firebase.service.FirebaseService;
import com.hobi.backend.request.CreateUserRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {
    private final FirebaseService firebaseService;

    @PostMapping("/register")
    public String createUser(@RequestBody CreateUserRequest createUserRequest) {
        return firebaseService.registerUser(createUserRequest);
    }

    @PostMapping("/preferences")
    public String da() {
        return "Da!";
    }
}

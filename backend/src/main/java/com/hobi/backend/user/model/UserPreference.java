package com.hobi.backend.user.model;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class UserPreference {

    private List<String> hobbies;

    public UserPreference() {
        this.hobbies = new ArrayList<>();
    }
}

package com.hobi.backend.user.model;

import com.hobi.backend.maps.model.NamedLocation;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class UserPreference {

    private List<String> hobbies;
    private List<NamedLocation> savedLocations;

    public UserPreference() {
        this.hobbies = new ArrayList<>();
        this.savedLocations = new ArrayList<>();
    }
}

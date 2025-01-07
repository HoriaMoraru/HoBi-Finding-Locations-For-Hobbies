package com.hobi.backend.user.model;

import com.hobi.backend.maps.model.NamedLocation;
import lombok.Data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
public class UserPreference {

    private List<String> hobbies;
    private Map<String, List<NamedLocation>> hobbyLocations;

    public UserPreference() {
        this.hobbies = new ArrayList<>();
        this.hobbyLocations = new HashMap<>();
    }
}

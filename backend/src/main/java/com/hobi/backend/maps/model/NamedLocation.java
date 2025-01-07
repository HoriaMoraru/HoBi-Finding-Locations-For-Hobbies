package com.hobi.backend.maps.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
public class NamedLocation extends Location {

    private String name;

    public NamedLocation(double lat, double lng, String name) {
        super(lat, lng);
        this.name = name;
    }
}

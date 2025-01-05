package com.hobi.backend.maps.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class Location {
    private double latitude;
    private double longitude;
}

package com.hobi.backend.user.model;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class Location {
    private double latitude;
    private double longitude;
}

package com.hobi.backend.request;

import com.hobi.backend.maps.model.Location;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UpdateLocationRequest {
    private Location location;
}

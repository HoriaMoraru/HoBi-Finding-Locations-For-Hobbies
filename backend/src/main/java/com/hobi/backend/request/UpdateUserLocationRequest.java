package com.hobi.backend.request;

import com.hobi.backend.maps.model.NamedLocation;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UpdateUserLocationRequest {
    private NamedLocation location;
}

package com.hobi.backend.request;

import com.hobi.backend.user.model.Location;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UpdateLocationRequest {
    private Location location;
}

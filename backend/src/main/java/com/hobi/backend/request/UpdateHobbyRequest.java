package com.hobi.backend.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UpdateHobbyRequest {
    private String hobby;
}

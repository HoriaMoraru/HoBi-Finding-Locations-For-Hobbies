package com.hobi.backend.maps.service;

import com.google.maps.GeoApiContext;
import com.google.maps.PlacesApi;
import com.google.maps.errors.ApiException;
import com.google.maps.model.LatLng;
import com.google.maps.model.PlacesSearchResponse;
import com.google.maps.model.PlacesSearchResult;
import com.hobi.backend.maps.model.Location;
import com.hobi.backend.maps.model.NamedLocation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class MapsService {

    private static final int SEARCH_RADIUS = 10000; // 10 km
    private static final String FETCH_SUCCESS_LOG = "Successfully fetched locations for hobby: {}";
    private static final String FETCH_START_LOG = "Fetching locations for hobby: {}, User Location: {}";
    private static final String IO_EXCEPTION_LOG = "IO exception encountered while fetching locations for hobby: {}";
    private static final String INTERRUPTED_EXCEPTION_LOG = "Interrupted exception encountered while fetching locations for hobby: {}";
    private static final String API_EXCEPTION_LOG = "API exception encountered while fetching locations for hobby: {}";

    private final GeoApiContext geoApiContext;

    public List<Location> fetchLocationsForHobby(Location userLocation, String hobby) {
        log.info(FETCH_START_LOG, hobby, userLocation);

        try {
            LatLng latlng = new LatLng(userLocation.getLatitude(), userLocation.getLongitude());

            PlacesSearchResponse response = PlacesApi.nearbySearchQuery(geoApiContext, latlng)
                    .radius(SEARCH_RADIUS)
                    .keyword(hobby)
                    .await();

            // Convert PlacesSearchResults into a list of Location objects
            List<Location> locations = new ArrayList<>();
            for (PlacesSearchResult result : response.results) {
                locations.add(new NamedLocation(
                        result.geometry.location.lat,
                        result.geometry.location.lng,
                        result.name
                ));
            }

            log.info(FETCH_SUCCESS_LOG, hobby);
            return locations;

        } catch (IOException e) {
            log.error(IO_EXCEPTION_LOG, hobby, e);
            return Collections.emptyList();
        } catch (InterruptedException e) {
            log.error(INTERRUPTED_EXCEPTION_LOG, hobby, e);
            Thread.currentThread().interrupt(); // Restore interrupted state
            return Collections.emptyList();
        } catch (ApiException e) {
            log.error(API_EXCEPTION_LOG, hobby, e);
            return Collections.emptyList();
        }
    }
}

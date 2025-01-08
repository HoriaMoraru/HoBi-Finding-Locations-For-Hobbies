package com.hobi.backend.maps.service;

import com.google.maps.DirectionsApi;
import com.google.maps.GeoApiContext;
import com.google.maps.PlacesApi;
import com.google.maps.errors.ApiException;
import com.google.maps.model.*;
import com.hobi.backend.maps.model.Location;
import com.hobi.backend.maps.model.NamedLocation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class MapsService {

    private static final int SEARCH_RADIUS = 10000; // 10 km
    private static final String FETCH_SUCCESS_LOG = "Successfully fetched locations for hobby: {}";
    private static final String FETCH_START_LOG = "Fetching locations for hobby: {}, User Location: {}";
    private static final String IO_EXCEPTION_LOG = "IO exception encountered while fetching locations for: {}";
    private static final String INTERRUPTED_EXCEPTION_LOG = "Interrupted exception encountered while fetching locations for: {}";
    private static final String API_EXCEPTION_LOG = "API exception encountered while fetching locations for: {}";
    private static final String ROUTE_FETCH_SUCCESS_LOG = "Successfully fetched route to location: {}";
    private static final String ROUTE_FETCH_ERROR_LOG = "Error fetching route to location: {}";

    private final GeoApiContext geoApiContext;

    public List<Location> fetchLocationsForHobby(Location userLocation, String hobby) {
        log.info(FETCH_START_LOG, hobby, userLocation);
        try {
            LatLng latlng = new LatLng(userLocation.getLat(), userLocation.getLng());

            PlacesSearchResponse response = PlacesApi.nearbySearchQuery(geoApiContext, latlng)
                    .radius(SEARCH_RADIUS)
                    .keyword(hobby.trim().toLowerCase())
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

    public Optional<DirectionsRoute> getRoute(Location origin, Location destination) {
        try {
            // Fetch the route using Google Maps Directions API
            DirectionsResult result = DirectionsApi.newRequest(geoApiContext)
                    .origin(new LatLng(origin.getLat(), origin.getLng()))
                    .destination(new LatLng(destination.getLat(), destination.getLng()))
                    .await();

            // Return the first route if available
            if (result.routes != null && result.routes.length > 0) {
                log.info(ROUTE_FETCH_SUCCESS_LOG, destination);
                return Optional.ofNullable(result.routes[0]); // Return the first route
            }

            log.warn("No routes found for destination: {}", destination);
            return Optional.empty();

        } catch (IOException e) {
            log.error(IO_EXCEPTION_LOG, destination, e);
            return Optional.empty();
        } catch (InterruptedException e) {
            log.error(INTERRUPTED_EXCEPTION_LOG, destination, e);
            Thread.currentThread().interrupt(); // Restore interrupted state
            return Optional.empty();
        } catch (ApiException e) {
            log.error(API_EXCEPTION_LOG, destination, e);
            return Optional.empty();
        }
    }
}

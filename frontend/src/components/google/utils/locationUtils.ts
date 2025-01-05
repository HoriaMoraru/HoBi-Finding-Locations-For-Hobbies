export interface LatLngLiteral {
    lat: number;
    lng: number;
}

/**
 * Calculates the distance between two geographic coordinates using the Haversine formula.
 * @param loc1 - The first location (latitude and longitude).
 * @param loc2 - The second location (latitude and longitude).
 * @returns The distance in meters between the two locations.
 */
export const getDistance = (loc1: LatLngLiteral, loc2: LatLngLiteral): number => {
    const R = 6371e3; // Radius of Earth in meters
    const toRad = (value: number) => (value * Math.PI) / 180;

    const lat1 = toRad(loc1.lat);
    const lat2 = toRad(loc2.lat);
    const deltaLat = toRad(loc2.lat - loc1.lat);
    const deltaLng = toRad(loc2.lng - loc1.lng);

    const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
};

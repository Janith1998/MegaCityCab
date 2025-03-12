package com.megacitycab.backend.service;
import org.springframework.stereotype.Service;
@Service
public class LocationService {

    private static final double RATE_PER_KM = 15.0; // Example rate per km

    // Method to calculate distance between two coordinates (in kilometers)
    public double calculateDistance(double pickupLat, double pickupLon, double dropoffLat, double dropoffLon) {
        // Convert degrees to radians
        double pickupLatRad = Math.toRadians(pickupLat);
        double pickupLonRad = Math.toRadians(pickupLon);
        double dropoffLatRad = Math.toRadians(dropoffLat);
        double dropoffLonRad = Math.toRadians(dropoffLon);

        // Haversine formula to calculate the distance
        double deltaLat = dropoffLatRad - pickupLatRad;
        double deltaLon = dropoffLonRad - pickupLonRad;

        double a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2)
                + Math.cos(pickupLatRad) * Math.cos(dropoffLatRad)
                * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double radiusOfEarth = 6371.0; // Radius of the Earth in km

        return radiusOfEarth * c; // Returns the distance in kilometers
    }

    // Method to calculate price based on distance
    public double calculatePrice(double distance) {
        return distance * RATE_PER_KM; // Price calculation based on rate per km
    }
}

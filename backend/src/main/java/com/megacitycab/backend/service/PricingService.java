package com.megacitycab.backend.service;

import org.springframework.stereotype.Service;

@Service
public class PricingService {

    // This method will calculate the price based on the distance between the pickup and drop-off locations
    public double calculatePrice(double pickupLat, double pickupLon, double dropoffLat, double dropoffLon) {
        // Example: Use Haversine formula to calculate distance in km
        double earthRadius = 6371; // Radius of the Earth in km
        double lat1 = Math.toRadians(pickupLat);
        double lon1 = Math.toRadians(pickupLon);
        double lat2 = Math.toRadians(dropoffLat);
        double lon2 = Math.toRadians(dropoffLon);

        double dLat = lat2 - lat1;
        double dLon = lon2 - lon1;

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        double distance = earthRadius * c; // Distance in km

        // Example price calculation logic (you can adjust this based on your needs)
        double pricePerKm = 10; // Set your price per km
        return distance * pricePerKm;
    }
}

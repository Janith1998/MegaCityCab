package com.megacitycab.backend.service;

import org.springframework.stereotype.Service;

@Service
public class PricingService {

   
    public double calculatePrice(double pickupLat, double pickupLon, double dropoffLat, double dropoffLon) {
       
        double earthRadius = 6371; 
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

        double distance = earthRadius * c; 

        
        double pricePerKm = 50; 
        return distance * pricePerKm;
    }
}

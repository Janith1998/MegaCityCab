package com.megacitycab.backend.model;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;
    private String bookingId;
    private String userId; // ID of the user making the booking
    private String carId; // ID of the car being booked
    private String pickupLocation;
    private String dropoffLocation;
    private double pickupLat;
    private double pickupLon;
    private double dropoffLat;
    private double dropoffLon;
    private double price;
    private Date pickupTime;
    private int passengers;
    private String luggage;
    private String additionalMessage;
    private String status; // e.g., "Pending", "Confirmed", "Completed"

    // Constructors, Getters, and Setters
    public Booking() {}

    public Booking(String userId, String carId, String pickupLocation, String dropoffLocation,
                   double pickupLat, double pickupLon, double dropoffLat, double dropoffLon,
                   double price, Date pickupTime, int passengers, String luggage, String additionalMessage) {
        this.userId = userId;
        this.carId = carId;
        this.pickupLocation = pickupLocation;
        this.dropoffLocation = dropoffLocation;
        this.pickupLat = pickupLat;
        this.pickupLon = pickupLon;
        this.dropoffLat = dropoffLat;
        this.dropoffLon = dropoffLon;
        this.price = price;
        this.pickupTime = pickupTime;
        this.passengers = passengers;
        this.luggage = luggage;
        this.additionalMessage = additionalMessage;
        this.status = "Pending"; // Default status
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getCarId() {
        return carId;
    }

    public void setCarId(String carId) {
        this.carId = carId;
    }

    public String getPickupLocation() {
        return pickupLocation;
    }

    public void setPickupLocation(String pickupLocation) {
        this.pickupLocation = pickupLocation;
    }

    public String getDropoffLocation() {
        return dropoffLocation;
    }

    public void setDropoffLocation(String dropoffLocation) {
        this.dropoffLocation = dropoffLocation;
    }

    public double getPickupLat() {
        return pickupLat;
    }

    public void setPickupLat(double pickupLat) {
        this.pickupLat = pickupLat;
    }

    public double getPickupLon() {
        return pickupLon;
    }

    public void setPickupLon(double pickupLon) {
        this.pickupLon = pickupLon;
    }

    public double getDropoffLat() {
        return dropoffLat;
    }

    public void setDropoffLat(double dropoffLat) {
        this.dropoffLat = dropoffLat;
    }

    public double getDropoffLon() {
        return dropoffLon;
    }

    public void setDropoffLon(double dropoffLon) {
        this.dropoffLon = dropoffLon;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public Date getPickupTime() {
        return pickupTime;
    }

    public void setPickupTime(Date pickupTime) {
        this.pickupTime = pickupTime;
    }

    public int getPassengers() {
        return passengers;
    }

    public void setPassengers(int passengers) {
        this.passengers = passengers;
    }

    public String getLuggage() {
        return luggage;
    }

    public void setLuggage(String luggage) {
        this.luggage = luggage;
    }

    public String getAdditionalMessage() {
        return additionalMessage;
    }

    public void setAdditionalMessage(String additionalMessage) {
        this.additionalMessage = additionalMessage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
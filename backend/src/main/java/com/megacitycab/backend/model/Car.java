package com.megacitycab.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "cars")
public class Car {

    @Id
    private String id;
    private String brand;
    private String model;
    private String licensePlate;
    private String driverId; // Link to the driver

    public Car() {}

    // Constructor
    public Car(String brand, String model, String licensePlate, String driverId) {
        this.brand = brand;
        this.model = model;
        this.licensePlate = licensePlate;
        this.driverId = driverId;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    public String getDriverId() {
        return driverId;
    }

    public void setDriverId(String driverId) {
        this.driverId = driverId;
    }
}

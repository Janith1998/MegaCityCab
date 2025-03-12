package com.megacitycab.backend.model;

public class PricingResponse {
    private double price;

    public PricingResponse(double price) {
        this.price = price;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}

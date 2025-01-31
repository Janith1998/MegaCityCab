package com.megacitycab.backend.model;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {

    @Id
    private String id;  // MongoDB will auto-generate this
    private String userId;  // Custom ID for each user (Admin, Driver, Customer) - Change to String
    private String password;
    private String role; // Admin, Driver, Customer
    private String name;
    private String email; // Used for login
    private String contactNumber;
    private String contactNumber2; // Optional for both Driver and Customer
    private String nicNumber;  // Optional for drivers only
    private String image; // Optional for drivers only
    private Date createdAt;
    private Date updatedAt;

    public User() {}

    // Constructor for Admin, Driver (userId auto-generated, role provided manually)
    public User(String password, String role, String name, String email, String contactNumber, String contactNumber2, String nicNumber, String image) {
        this.password = password;
        this.role = role;
        this.name = name;
        this.email = email;
        this.contactNumber = contactNumber;
        this.contactNumber2 = contactNumber2;
        this.nicNumber = nicNumber;
        this.image = image;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    // Constructor for Customer (with auto-generated userId)
    public User(String userId, String password, String name, String email, String contactNumber, String contactNumber2) {
        this.userId = userId;
        this.password = password;
        this.role = "Customer";
        this.name = name;
        this.email = email;
        this.contactNumber = contactNumber;
        this.contactNumber2 = contactNumber2;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;  // Change to return String
    }

    public void setUserId(String userId) {  // Change parameter type to String
        this.userId = userId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getContactNumber2() {
        return contactNumber2;
    }

    public void setContactNumber2(String contactNumber2) {
        this.contactNumber2 = contactNumber2;
    }

    public String getNicNumber() {
        return nicNumber;
    }

    public void setNicNumber(String nicNumber) {
        this.nicNumber = nicNumber;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
}

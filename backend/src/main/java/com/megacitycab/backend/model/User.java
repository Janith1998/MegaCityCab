package com.megacitycab.backend.model;
import java.io.IOException;
import java.util.Base64;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.web.multipart.MultipartFile;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String userId;
    private String name;
    private String email;
    private String contactNumber;
    private String contactNumber2;
    private String nicNumber;
    private String role;
    private String password;
    private String image; 
    private String[] nicImages;
    private String assignedCarLicensePlate;

    public User() {}

    // Constructor for "Customer" user (without NIC images)
    public User(String password, String role, String name, String email, String contactNumber, 
                String contactNumber2, MultipartFile userImage, MultipartFile[] nicImages) {
        this.password = password;
        this.role = role;
        this.name = name;
        this.email = email;
        this.contactNumber = contactNumber;
        this.contactNumber2 = contactNumber2;
        
        // Handle image encoding (if image exists)
        this.image = userImage != null ? encodeImageToBase64(userImage) : null;
        this.nicImages = nicImages != null ? encodeNicImagesToBase64(nicImages) : null;
    }

    // Constructor for "Driver" user (with NIC number)
    public User(String password, String role, String name, String email, String contactNumber,
                String contactNumber2, String nicNumber, MultipartFile userImage, MultipartFile[] nicImages) {
        this(password, role, name, email, contactNumber, contactNumber2, userImage, nicImages);
        this.nicNumber = nicNumber;
    }

    // Method to convert a MultipartFile image to Base64
    private String encodeImageToBase64(MultipartFile file) {
        try {
            byte[] bytes = file.getBytes();
            return Base64.getEncoder().encodeToString(bytes);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    

    // Method to convert multiple NIC images to Base64
    private String[] encodeNicImagesToBase64(MultipartFile[] files) {
        String[] encodedImages = new String[files.length];
        for (int i = 0; i < files.length; i++) {
            encodedImages[i] = encodeImageToBase64(files[i]);
        }
        return encodedImages;
    }

        public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    // Getters and Setters for all fields
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUserImage() {
        return image;
    }

    public void setUserImage(String image) {
        this.image = image;
    }

    public String[] getNicImages() {
        return nicImages;
    }

    public void setNicImages(String[] nicImages) {
        this.nicImages = nicImages;
    }

    public String getAssignedCarLicensePlate() {
        return assignedCarLicensePlate;
    }

    public void setAssignedCarLicensePlate(String assignedCarLicensePlate) {
        this.assignedCarLicensePlate = assignedCarLicensePlate;
    }
}



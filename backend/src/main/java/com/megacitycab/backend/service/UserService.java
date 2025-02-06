package com.megacitycab.backend.service;

import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.megacitycab.backend.model.User;
import com.megacitycab.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;

    // Role prefix mapping
    private static final Map<String, String> ROLE_PREFIXES = Map.of(
        "Customer", "cus",
        "Driver", "dri"
    );

    // Method to find user by email
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email); // Return Optional<User> directly
    }

    // Method to check if email exists
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email); // Assuming this method exists in UserRepository
    }

    // Method to create a user with auto-generated ID
    public User createUser(User user, MultipartFile image, List<String> nicImages) {
        // Check if the email already exists
        if (existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }

        // Convert image to base64 if present
        if (image != null) {
            user.setUserImage(encodeFileToBase64(image));
        }

        // Set NIC images if provided
        if (nicImages != null && !nicImages.isEmpty()) {
            user.setNicImages(nicImages.toArray(new String[0]));  // Store list of NIC images
        }

        // Generate user ID based on the role
        String role = user.getRole();
        String generatedId = generateUserId(role);
        user.setUserId(generatedId);

        // Save and return the user
        return userRepository.save(user);
    }

    // Helper method to generate the user ID based on the role
    private String generateUserId(String role) {
        String prefix = ROLE_PREFIXES.getOrDefault(role, "usr"); // Default prefix "usr" for unknown roles
        int sequenceValue = sequenceGeneratorService.generateSequence(role + "Id");
        return prefix + String.format("%03d", sequenceValue);
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll(); // Fetch all users from the repository
    }

    // Get user by ID
    public User getUserById(String id) {
        return userRepository.findById(id).orElse(null); // Return user or null if not found
    }

    // Delete user by ID
    public void deleteUser(String id) {
        Optional<User> userOptional = userRepository.findById(id);
        
        if (userOptional.isPresent()) {
            userRepository.deleteById(id);
            System.out.println("User deleted successfully: " + id);
        } else {
            throw new RuntimeException("User not found with ID: " + id);
        }
    }
    




    // Add a new driver (with image handling)
    public User addDriver(String name, String email, String contactNumber, String contactNumber2,
        String nicNumber, MultipartFile userImage, MultipartFile[] nicImages, String password) {
            User driver = new User();
            driver.setName(name);
            driver.setEmail(email);
            driver.setContactNumber(contactNumber);
            driver.setContactNumber2(contactNumber2);
            driver.setNicNumber(nicNumber);
            driver.setRole("Driver");  // Ensure role is set to "Driver"
            driver.setPassword(password);  // Save the password field

            // Generate user ID based on the role
            String role = driver.getRole();
            String generatedId = generateUserId(role);  // This will call the generateUserId method
            driver.setUserId(generatedId);  // Set the generated user ID

            // Handle user image (if present)
            if (userImage != null) {
            driver.setUserImage(encodeFileToBase64(userImage)); // Convert image to base64
            }

            // Handle NIC images (if present)
            if (nicImages != null && nicImages.length > 0) {
            // Convert NIC images to base64 (you can adapt how you handle these images based on your requirements)
            String[] nicImageBase64 = new String[nicImages.length];
            for (int i = 0; i < nicImages.length; i++) {
            nicImageBase64[i] = encodeFileToBase64(nicImages[i]);
            }
            driver.setNicImages(nicImageBase64); // Set the NIC images
            }

            return userRepository.save(driver);  // Save the driver with generated userId
            }


    // Helper method to convert a MultipartFile to base64 string
    private String encodeFileToBase64(MultipartFile file) {
        try {
            byte[] fileBytes = file.getBytes();
            return Base64.getEncoder().encodeToString(fileBytes);  // Correct method
        } catch (Exception e) {
            throw new RuntimeException("Error encoding file to Base64", e);
        }
    }




    
    public User updateUser(String id, User updatedUser, MultipartFile userImage, List<String> nicImages, String password) {
        return userRepository.findById(id).map(user -> {
            boolean updated = false;
    
            // Update name if provided and different
            if (updatedUser.getName() != null && !updatedUser.getName().equals(user.getName())) {
                user.setName(updatedUser.getName());
                updated = true;
            }
    
            // Update email if provided and different
            if (updatedUser.getEmail() != null && !updatedUser.getEmail().equals(user.getEmail())) {
                user.setEmail(updatedUser.getEmail());
                updated = true;
            }
    
            // Update contactNumber if provided and different
            if (updatedUser.getContactNumber() != null && !updatedUser.getContactNumber().equals(user.getContactNumber())) {
                user.setContactNumber(updatedUser.getContactNumber());
                updated = true;
            }
    
            // Update contactNumber2 if provided and different
            if (updatedUser.getContactNumber2() != null && !updatedUser.getContactNumber2().equals(user.getContactNumber2())) {
                user.setContactNumber2(updatedUser.getContactNumber2());
                updated = true;
            }
    
            // Validate NIC images (required for drivers)
            if (user.getRole().equals("Driver") && (nicImages == null || nicImages.isEmpty())) {
                if (user.getNicImages() == null || user.getNicImages().length == 0) {
                    throw new RuntimeException("NIC images are required for drivers.");
                }
            }
    
            // Update NIC images if provided and different
             if (nicImages != null && !nicImages.isEmpty()) {
            user.setNicImages(nicImages.toArray(new String[0]));  // Store NIC images
            updated = true;
             }
    
            // Update user image if provided and different
             if (userImage != null && !userImage.isEmpty()) {
            user.setUserImage(encodeFileToBase64(userImage));  // Convert image to base64
            updated = true;
             }
    
            // Update password if provided and different
            if (password != null && !password.isEmpty() && !password.equals(user.getPassword())) {
                user.setPassword(password);  // Update password field
                updated = true;
            }
    
            // Save only if any updates were made
            if (updated) {
                return userRepository.save(user);
            } else {
                return user;  // Return user without saving if no changes were made
            }
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    




    
}


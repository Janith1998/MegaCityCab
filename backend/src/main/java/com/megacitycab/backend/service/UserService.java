package com.megacitycab.backend.service;

import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.megacitycab.backend.model.User;
import com.megacitycab.backend.repository.CarRepository;
import com.megacitycab.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CarRepository carRepository;


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
            driver.setRole("Driver");  
            driver.setPassword(password);  

           
            String role = driver.getRole();
            String generatedId = generateUserId(role);  
            driver.setUserId(generatedId);  

           
            if (userImage != null) {
            driver.setUserImage(encodeFileToBase64(userImage)); 
            }

   
            if (nicImages != null && nicImages.length > 0) {
           
            String[] nicImageBase64 = new String[nicImages.length];
            for (int i = 0; i < nicImages.length; i++) {
            nicImageBase64[i] = encodeFileToBase64(nicImages[i]);
            }
            driver.setNicImages(nicImageBase64); 
            }

            return userRepository.save(driver); 
            }


        // Add a new customer 
        public User addCustomer(String name, String email, String contactNumber,String nicNumber, String password) {
            User customer = new User();
            customer.setName(name);
            customer.setEmail(email);
            customer.setContactNumber(contactNumber);
            customer.setNicNumber(nicNumber);
            customer.setRole("Customer");  
            customer.setPassword(password);  
        
            String role = customer.getRole();
            String generatedId = generateUserId(role);  
            customer.setUserId(generatedId);  


            return userRepository.save(customer);  
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
    
    



    // Method to assign or unassign a car to a driver by userId
public String assignCarToDriver(String userId, String licensePlate) {
    // Find the driver by userId
    User driver = userRepository.findByUserId(userId);

    if (driver != null && "Driver".equals(driver.getRole())) {
        // If licensePlate is null, unassign the car
        if (licensePlate == null) {
            driver.setAssignedCarLicensePlate(null); // Unassign the car
        } else {
            driver.setAssignedCarLicensePlate(licensePlate); // Assign the car
        }
        userRepository.save(driver); // Save the updated driver

        return "Car assigned successfully!";
    } else {
        return "Driver not found or invalid role!";
    }
}





    
}


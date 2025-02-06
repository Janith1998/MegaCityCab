package com.megacitycab.backend.Controller;

import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.megacitycab.backend.model.User;
import com.megacitycab.backend.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    private String encodeFileToBase64(MultipartFile file) {
        try {
            byte[] fileBytes = file.getBytes();
            return Base64.getEncoder().encodeToString(fileBytes);  // Correct method for encoding to base64
        } catch (Exception e) {
            throw new RuntimeException("Error encoding file to Base64", e);
        }
    }
    

    // Get all users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error fetching all users: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get all drivers
    @GetMapping("/drivers")
    public ResponseEntity<List<User>> getAllDrivers() {
        try {
            List<User> drivers = userService.getAllUsers()
                    .stream()
                    .filter(user -> "Driver".equalsIgnoreCase(user.getRole()))
                    .collect(Collectors.toList());
            return new ResponseEntity<>(drivers, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error fetching all drivers: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        try {
            User user = userService.getUserById(id);
            if (user != null) {
                return new ResponseEntity<>(user, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND); // User not found
            }
        } catch (Exception e) {
            logger.error("Error fetching user by ID: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete user by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable String id) {
        try {
            userService.deleteUser(id);
            return new ResponseEntity<>("User deleted successfully!", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            logger.error("Error deleting user: {}", e.getMessage());
            return new ResponseEntity<>("An error occurred while deleting the user", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    


  

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
        @PathVariable String id,
        @RequestParam("name") String name,
        @RequestParam("email") String email,
        @RequestParam("contactNumber") String contactNumber,
        @RequestParam(value = "password", required = false) String password,
        @RequestParam(value = "userImage", required = false) MultipartFile userImage,
        @RequestParam(value = "nicImages", required = false) MultipartFile[] nicImages) {
    
        try {
            // Fetch the existing user details
            User existingUser = userService.getUserById(id);
            if (existingUser == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
    
            // Convert nicImages to List<String> if provided, otherwise keep the existing images
            List<String> nicImageList = (nicImages != null && nicImages.length > 0) 
                ? Arrays.stream(nicImages)
                        .filter(file -> file != null && !file.isEmpty())
                        .map(this::encodeFileToBase64)
                        .collect(Collectors.toList()) 
                        : Arrays.asList(existingUser.getNicImages());
    
            // Create a new User object with updated details
            User updatedUser = new User();
            updatedUser.setName(name);
            updatedUser.setEmail(email);
            updatedUser.setContactNumber(contactNumber);
            updatedUser.setPassword(password);
    
            // Update user in the service
            User result = userService.updateUser(id, updatedUser, userImage, nicImageList, password);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error updating user: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    




}

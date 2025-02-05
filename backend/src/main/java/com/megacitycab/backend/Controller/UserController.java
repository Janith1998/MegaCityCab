package com.megacitycab.backend.Controller;

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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
        } catch (Exception e) {
            logger.error("Error deleting user: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update user details
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User updatedUser) {
        try {
            User user = userService.updateUser(id, updatedUser);
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error updating user: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Bad Request for validation errors
        }
    }

    // Add a new driver
    @PostMapping("/drivers")
    public ResponseEntity<User> addDriver(@RequestParam("name") String name,
                                          @RequestParam("email") String email,
                                          @RequestParam("contactNumber") String contactNumber,
                                          @RequestParam(value = "contactNumber2", required = false) String contactNumber2,
                                          @RequestParam("nicNumber") String nicNumber,
                                          @RequestParam(value = "userImage", required = false) MultipartFile userImage,
                                          @RequestParam(value = "nicImages", required = false) MultipartFile[] nicImages,
                                          @RequestParam("password") String password) {
        try {
            User driver = userService.addDriver(name, email, contactNumber, contactNumber2, nicNumber, userImage, nicImages, password);
            return new ResponseEntity<>(driver, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Error adding driver: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
}

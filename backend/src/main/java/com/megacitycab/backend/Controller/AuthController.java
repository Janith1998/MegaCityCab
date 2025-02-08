package com.megacitycab.backend.Controller;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.megacitycab.backend.model.User;
import com.megacitycab.backend.service.UserService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;  // Inject UserService

    public AuthController(UserService userService) {
        this.userService = userService;  // Assign injected service
    }

    // Login endpoint, return Response object
    @PostMapping("/login")
    public Response login(@RequestParam String email, @RequestParam String password) {
        // Use UserService to find user by email
        Optional<User> optionalUser = userService.findByEmail(email);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getPassword().equals(password)) {
                return new Response("Login successful!", user.getRole());
            }
        }

        return new Response("Invalid email or password", null);
    }

    // Register driver endpoint (save user to DB)

    @PostMapping("/register")
    public String register(@RequestParam String email, 
                       @RequestParam String password,
                       @RequestParam String role, // added role
                       @RequestParam String name,
                       @RequestParam String contactNumber,
                       @RequestParam(required = false) String contactNumber2,
                       @RequestParam(required = false) String nicNumber,
                       @RequestParam(required = false) MultipartFile userImage,  // Changed to MultipartFile for image upload
                       @RequestParam(required = false) MultipartFile[] nicImages) {  // Changed to MultipartFile array for multiple image uploads

    // Use UserService to check if email already exists
    if (userService.existsByEmail(email)) {
        return "Email already exists!";
    }

    // Create a new user based on role and input data
    User user;
    if (role.equalsIgnoreCase("Customer")) {
        user = new User(password, role, name, email, contactNumber, contactNumber2, userImage, nicImages);
    } else if (role.equalsIgnoreCase("Driver")) {
        user = new User(password, role, name, email, contactNumber, contactNumber2, nicNumber, userImage, nicImages);
    } else {
        return "Invalid role!";
    }

    // Convert nicImages to a List<String> (you may need to change this based on how you handle images)
    List<String> nicImagePaths = Arrays.stream(nicImages)
                                       .map(file -> file.getOriginalFilename())  // Save the file names or paths as per your logic
                                       .collect(Collectors.toList());

    // Use UserService to generate userId and save the user, passing the image and NIC images
    userService.createUser(user, userImage, nicImagePaths);  // Now passing all required arguments

    return "User registered successfully!";
}


    // Response DTO class to return the message and role
    public static class Response {
        private String message;
        private String role;

        public Response(String message, String role) {
            this.message = message;
            this.role = role;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }
}

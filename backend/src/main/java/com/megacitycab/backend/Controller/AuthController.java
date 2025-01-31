package com.megacitycab.backend.Controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
        User user = userService.findByEmail(email);  // Modify this method in UserService to search by email

        if (user != null && user.getPassword().equals(password)) {
            // Return a Response object with the message and role
            return new Response("Login successful!", user.getRole());
        } else {
            return new Response("Invalid email or password", null); // change message to "Invalid email"
        }
    }

    // Register endpoint (save user to DB)
    @PostMapping("/register")
    public String register(@RequestParam String email, 
                           @RequestParam String password,
                           @RequestParam String role, // added role
                           @RequestParam String name,
                           @RequestParam String contactNumber,
                           @RequestParam(required = false) String contactNumber2,
                           @RequestParam(required = false) String nicNumber,
                           @RequestParam(required = false) String image) {
        // Use UserService to check if email already exists
        if (userService.existsByEmail(email)) {
            return "Email already exists!";
        }

        // Create a new user based on role and input data
        User user;
        if (role.equalsIgnoreCase("Customer")) {
            user = new User(password, role, name, email, contactNumber, contactNumber2);
        } else if (role.equalsIgnoreCase("Driver")) {
            user = new User(password, role, name, email, contactNumber, contactNumber2, nicNumber, image);
        } else {
            return "Invalid role!";
        }

        // Use UserService to generate userId and save the user
        userService.createUser(user);  // This will generate userId and save the user

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

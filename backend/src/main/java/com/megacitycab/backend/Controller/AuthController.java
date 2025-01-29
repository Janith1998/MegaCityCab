package com.megacitycab.backend.Controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.megacitycab.backend.model.User;
import com.megacitycab.backend.repository.UserRepository;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Login endpoint, return Response object
    @PostMapping("/login")
    public Response login(@RequestParam String username, @RequestParam String password) {
        User user = userRepository.findByUsername(username);

        if (user != null && user.getPassword().equals(password)) {
            // Return a Response object with the message and role
            return new Response("Login successful!", user.getRole());
        } else {
            return new Response("Invalid username or password", null);
        }
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

    // Register endpoint (kept as it is)
    @PostMapping("/register")
    public String register(@RequestParam String username, @RequestParam String password) {
        // Registration logic, save user to DB (simplified)
        return "User registered successfully!";
    }
}

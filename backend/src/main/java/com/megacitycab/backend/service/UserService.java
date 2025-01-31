package com.megacitycab.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.megacitycab.backend.model.User;
import com.megacitycab.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;

    // Method to find user by email
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);  // Assuming you have a method in your repository
    }

    // Method to check if email exists
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);  // Assuming you have a method in your repository
    }

    // Method to create a user with auto-generated ID
    public User createUser(User user) {
        String role = user.getRole();
        String generatedId = generateUserId(role);
        user.setUserId(generatedId);
        return userRepository.save(user); // Save the user
    }

    // Helper method to generate the user ID based on the role
    private String generateUserId(String role) {
        String prefix = "";

        if (role.equalsIgnoreCase("Customer")) {
            prefix = "cus";
        } else if (role.equalsIgnoreCase("Driver")) {
            prefix = "dri";
        }

        int sequenceValue = sequenceGeneratorService.generateSequence(role + "Id");
        return prefix + String.format("%03d", sequenceValue);
    }
}

package com.megacitycab.backend.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.megacitycab.backend.model.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email); 
    boolean existsByEmail(String email); 
    User findByUserId(String userId);
}

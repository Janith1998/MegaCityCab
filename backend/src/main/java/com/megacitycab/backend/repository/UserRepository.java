package com.megacitycab.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.megacitycab.backend.model.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email); // change to email
    boolean existsByEmail(String email); // change to email
}

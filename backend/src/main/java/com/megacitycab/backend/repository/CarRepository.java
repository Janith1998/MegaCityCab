package com.megacitycab.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.megacitycab.backend.model.Car;

@Repository
public interface CarRepository extends MongoRepository<Car, String> {
     List<Car> findByAvailableTrue();
}

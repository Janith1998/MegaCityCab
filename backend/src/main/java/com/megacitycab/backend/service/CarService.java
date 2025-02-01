package com.megacitycab.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.megacitycab.backend.model.Car;
import com.megacitycab.backend.repository.CarRepository;

@Service
public class CarService {

    @Autowired
    private CarRepository carRepository;

    public Car addCar(Car car) {
        return carRepository.save(car);  // Save the car to the database
    }

        public List<Car> getAllCars() {
        return carRepository.findAll();  // Retrieve all cars from the database
    }

    public void deleteCar(String id) {
        carRepository.deleteById(id);  // Delete the car from the repository
    }

}

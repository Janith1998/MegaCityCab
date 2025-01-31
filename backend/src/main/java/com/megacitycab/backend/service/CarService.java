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

    public Car assignCarToDriver(String carId, String driverId) {
        Car car = carRepository.findById(carId).orElse(null);
        if (car != null) {
            car.setDriverId(driverId);  // Assign the driver to the car
            return carRepository.save(car);  // Save the updated car
        }
        return null;
    }
}

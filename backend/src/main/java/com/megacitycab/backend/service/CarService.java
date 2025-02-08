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
        car.setAvailable(true);
        return carRepository.save(car);  // Save the car to the database
    }

        public List<Car> getAllCars() {
        return carRepository.findAll();  // Retrieve all cars from the database
    }

    public void deleteCar(String id) {
        carRepository.deleteById(id);  // Delete the car from the repository
    }

    public Car updateCarAvailability(String id, boolean available) {
        Car car = carRepository.findById(id).orElseThrow(() -> new RuntimeException("Car not found"));
        car.setAvailable(available);
        return carRepository.save(car); // This will return the updated car
    }

    public Car updateCar(String id, Car updatedCar) {
        Car car = carRepository.findById(id).orElseThrow(() -> new RuntimeException("Car not found"));
        car.setBrand(updatedCar.getBrand());
        car.setModel(updatedCar.getModel());
        car.setLicensePlate(updatedCar.getLicensePlate());
        car.setImage(updatedCar.getImage()); // Update image if provided
        return carRepository.save(car);
    }
    
    public List<Car> getAvailableCars() {
        return carRepository.findByAvailableTrue(); 
    }

}



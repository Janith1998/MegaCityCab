package com.megacitycab.backend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.megacitycab.backend.model.Car;
import com.megacitycab.backend.service.CarService;

@RestController
@RequestMapping("/cars")
public class CarController {

    @Autowired
    private CarService carService;

    // Endpoint to add a car
    @PostMapping("/add")
    public Car addCar(@RequestBody Car car) {
        return carService.addCar(car);  // Add the car to the database
    }

        // Endpoint to get all cars
    @GetMapping("/")
    public List<Car> getAllCars() {
        return carService.getAllCars();  // Get all cars from the database
    }

    // Endpoint to assign a car to a driver
    @PostMapping("/assign")
    public Car assignCarToDriver(@RequestParam String carId, @RequestParam String driverId) {
        return carService.assignCarToDriver(carId, driverId);  // Assign car to the driver
    }


}

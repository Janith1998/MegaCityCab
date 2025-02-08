package com.megacitycab.backend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
    @GetMapping
    public List<Car> getAllCars() {
        return carService.getAllCars();
    }
    
    // Fetch only available cars
    @GetMapping("/available")
    public List<Car> getAvailableCars() {
    return carService.getAvailableCars(); 
}

    @DeleteMapping("/{id}")
    public void deleteCar(@PathVariable String id) {
        carService.deleteCar(id);  // Delete the car from the database
}

    @PutMapping("/{id}/available")
    public Car updateCarAvailability(@PathVariable String id, @RequestBody boolean available) {
    return carService.updateCarAvailability(id, available);
}

    @PutMapping("/{id}")
    public Car updateCar(@PathVariable String id, @RequestBody Car updatedCar) {
        return carService.updateCar(id, updatedCar);
    }
    
        

}

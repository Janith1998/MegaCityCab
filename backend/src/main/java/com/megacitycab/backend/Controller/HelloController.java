package com.megacitycab.backend.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    @GetMapping("/")
    public String sayHello() {
        return "Mega City Cab Backend is Running!";
    }
}

package com.megacitycab.backend.Controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.megacitycab.backend.model.PricingRequest;
import com.megacitycab.backend.model.PricingResponse;
import com.megacitycab.backend.service.PricingService;

@RestController
@RequestMapping("/pricing")
public class PricingController {

    @Autowired
    private PricingService pricingService;

    @PostMapping("/calculation")
    public PricingResponse calculatePrice(@RequestBody PricingRequest pricingRequest) {
        double price = pricingService.calculatePrice(pricingRequest.getPickupLat(), pricingRequest.getPickupLon(), 
                                                     pricingRequest.getDropoffLat(), pricingRequest.getDropoffLon());
        return new PricingResponse(price);
    }
}

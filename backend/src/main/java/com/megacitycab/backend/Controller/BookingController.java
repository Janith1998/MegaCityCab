package com.megacitycab.backend.Controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.megacitycab.backend.model.Booking;
import com.megacitycab.backend.repository.BookingRepository;
import com.megacitycab.backend.service.SequenceGeneratorService;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;



// Create booking
    @PostMapping
public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
    try {
        String bookingId = sequenceGeneratorService.generateBookingId();
        booking.setBookingId(bookingId);
        booking.setStatus("Pending");
        booking.setCustomerId(booking.getUserId());  // Set customerId
        booking.setDriverId(null);                  // No driver initially
        Booking savedBooking = bookingRepository.save(booking);
        return new ResponseEntity<>(savedBooking, HttpStatus.CREATED);
    } catch (Exception e) {
        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

    // Get all bookings
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        try {
            List<Booking> bookings = bookingRepository.findAll();
            return new ResponseEntity<>(bookings, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get booking by ID
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable String id) {
        try {
            Booking booking = bookingRepository.findById(id).orElse(null);
            if (booking != null) {
                return new ResponseEntity<>(booking, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUserId(@PathVariable String userId) {
        try {
            List<Booking> bookings = bookingRepository.findByUserId(userId);
            return new ResponseEntity<>(bookings, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    // Delete booking by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable String id) {
        try {
            bookingRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update booking by ID
    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBooking(@PathVariable String id, @RequestBody Booking updatedBooking) {
        try {
            Booking existingBooking = bookingRepository.findById(id).orElse(null);
            if (existingBooking != null) {
                existingBooking.setPickupLocation(updatedBooking.getPickupLocation());
                existingBooking.setDropoffLocation(updatedBooking.getDropoffLocation());
                existingBooking.setStatus(updatedBooking.getStatus());
                // Update other fields as needed
                bookingRepository.save(existingBooking);
                return new ResponseEntity<>(existingBooking, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

@PutMapping("/{id}/assign-driver")
public ResponseEntity<Booking> assignDriverToBooking(@PathVariable String id, @RequestBody Map<String, String> payload) {
    try {
        String driverId = payload.get("userId");
        Booking booking = bookingRepository.findById(id).orElse(null);
        if (booking == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        booking.setDriverId(driverId);  // Set driverId instead of userId
        booking.setStatus("Assigned");
        bookingRepository.save(booking);

        sendNotificationToUser(driverId, "You have been assigned to a new booking!");
        return new ResponseEntity<>(booking, HttpStatus.OK);
    } catch (Exception e) {
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

// Get bookings by customer
@GetMapping("/customer/{customerId}")
public ResponseEntity<List<Booking>> getBookingsByCustomerId(@PathVariable String customerId) {
    try {
        List<Booking> bookings = bookingRepository.findByCustomerId(customerId);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    } catch (Exception e) {
        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

// Get bookings by driver
@GetMapping("/driver/{driverId}")
public ResponseEntity<List<Booking>> getBookingsByDriverId(@PathVariable String driverId) {
    try {
        List<Booking> bookings = bookingRepository.findByDriverId(driverId);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    } catch (Exception e) {
        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

private void sendNotificationToUser(String userId, String message) {
    // Implement notification logic (e.g., email, SMS, or push notification)
    System.out.println("Notification sent to driver " + userId + ": " + message);
}


// Get bookings assigned to a specific driver
@GetMapping("/assign-driver/{userId}")
public ResponseEntity<List<Booking>> getBookingsByuserId(@PathVariable String userId) {
    try {
        List<Booking> bookings = bookingRepository.findByUserId(userId);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    } catch (Exception e) {
        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

// Confirm a booking
@PutMapping("/confirm/{bookingId}")
public ResponseEntity<Booking> confirmBooking(@PathVariable String bookingId) {
    try {
        System.out.println("Confirming booking with bookingId: " + bookingId); // Logging
        Booking booking = bookingRepository.findByBookingId(bookingId); // Use findByBookingId
        if (booking == null) {
            System.out.println("Booking not found with bookingId: " + bookingId); // Logging
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        booking.setStatus("Confirmed");
        bookingRepository.save(booking);
        System.out.println("Booking confirmed: " + bookingId); // Logging
        return new ResponseEntity<>(booking, HttpStatus.OK);
    } catch (Exception e) {
        System.out.println("Error confirming booking: " + e.getMessage()); // Logging
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

// Cancel a booking
@PutMapping("/cancel/{bookingId}")
public ResponseEntity<Booking> cancelBooking(@PathVariable String bookingId) {
    try {
        System.out.println("Canceling booking with bookingId: " + bookingId); // Logging
        Booking booking = bookingRepository.findByBookingId(bookingId); // Use findByBookingId
        if (booking == null) {
            System.out.println("Booking not found with bookingId: " + bookingId); // Logging
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        booking.setStatus("Pending");
        bookingRepository.save(booking);
        System.out.println("Booking canceled: " + bookingId); // Logging
        return new ResponseEntity<>(booking, HttpStatus.OK);
    } catch (Exception e) {
        System.out.println("Error canceling booking: " + e.getMessage()); // Logging
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

@GetMapping("/count/pending")
public ResponseEntity<Long> countPendingBookings() {
    try {
        long count = bookingRepository.countByStatus("Pending");
        return new ResponseEntity<>(count, HttpStatus.OK);
    } catch (Exception e) {
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}


// Complete a booking
@PutMapping("/complete/{bookingId}")
public ResponseEntity<Booking> completeBooking(@PathVariable String bookingId) {
    try {
        System.out.println("Completing booking with bookingId: " + bookingId);
        Booking booking = bookingRepository.findByBookingId(bookingId);
        if (booking == null) {
            System.out.println("Booking not found with bookingId: " + bookingId);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        booking.setStatus("Completed");
        bookingRepository.save(booking);
        System.out.println("Booking completed: " + bookingId);
        return new ResponseEntity<>(booking, HttpStatus.OK);
    } catch (Exception e) {
        System.out.println("Error completing booking: " + e.getMessage());
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

// In BookingController.java
@GetMapping("/user/active/{userId}")
public ResponseEntity<List<Booking>> getActiveBookingsByUserId(@PathVariable String userId) {
    try {
        List<String> statuses = Arrays.asList("Pending", "Assigned", "Confirmed");
        List<Booking> bookings = bookingRepository.findByUserIdAndStatusIn(userId, statuses);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    } catch (Exception e) {
        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

// Get bookings assigned to a specific driver (using driverId)
@GetMapping("/driver-assigned/{driverId}")
public ResponseEntity<List<Booking>> getBookingsAssignedToDriver(@PathVariable String driverId) {
    try {
        List<Booking> bookings = bookingRepository.findByDriverIdAndStatusIn(
            driverId, 
            Arrays.asList("Assigned", "Confirmed")
        );
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    } catch (Exception e) {
        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

}
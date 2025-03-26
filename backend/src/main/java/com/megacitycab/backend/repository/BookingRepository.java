package com.megacitycab.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.megacitycab.backend.model.Booking;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
     List<Booking> findByUserId(String userId);
     Booking findByBookingId(String bookingId);
     long countByStatus(String status);
     List<Booking> findByUserIdAndStatusIn(String userId, List<String> statuses);
     List<Booking> findByCustomerId(String customerId);
    List<Booking> findByDriverId(String driverId);
    List<Booking> findByDriverIdAndStatusIn(String driverId, List<String> statuses);
     
     
     
}
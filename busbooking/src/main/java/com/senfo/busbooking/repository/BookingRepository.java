package com.senfo.busbooking.repository;

import com.senfo.busbooking.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByBusIdAndSeatNumber(Long busId, int seatNumber);
}
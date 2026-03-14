package com.senfo.busbooking.controller;

import com.senfo.busbooking.dto.ApiResponse;
import com.senfo.busbooking.model.Booking;
import com.senfo.busbooking.model.Bus;
import com.senfo.busbooking.repository.BookingRepository;
import com.senfo.busbooking.repository.BusRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/booking")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BusRepository busRepository;

    // 🟢 Book Seat (Professional Version)
    @PostMapping("/book")
    public ResponseEntity<ApiResponse> bookSeat(@RequestParam Long busId,
                                                @RequestParam String passengerName,
                                                @RequestParam int seatNumber,
                                                @RequestParam String bookingDate) {

        Bus bus = busRepository.findById(busId)
                .orElseThrow(() -> new RuntimeException("Bus not found"));

        // Seat limit validation
        if (seatNumber <= 0 || seatNumber > bus.getTotalSeats()) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(
                            "FAILED",
                            "Invalid seat number! Must be between 1 and " + bus.getTotalSeats(),
                            null
                    ));
        }

        Optional<Booking> existingBooking =
                bookingRepository.findByBusIdAndSeatNumber(busId, seatNumber);

        if (existingBooking.isPresent()) {
            return ResponseEntity.status(409)
                    .body(new ApiResponse(
                            "FAILED",
                            "Seat already booked!",
                            null
                    ));
        }

        Booking booking = new Booking();
        booking.setPassengerName(passengerName);
        booking.setSeatNumber(seatNumber);
        booking.setBookingDate(bookingDate);
        booking.setBus(bus);

        Booking savedBooking = bookingRepository.save(booking);

        return ResponseEntity.ok(
                new ApiResponse(
                        "SUCCESS",
                        "Booking successful!",
                        savedBooking.getId()
                )
        );
    }

    // 🟢 Get All Bookings
    @GetMapping("/all")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingRepository.findAll());
    }

    // 🟢 Cancel Booking
    @DeleteMapping("/cancel/{id}")
    public ResponseEntity<ApiResponse> cancelBooking(@PathVariable Long id) {

        if (!bookingRepository.existsById(id)) {
            return ResponseEntity.status(404)
                    .body(new ApiResponse(
                            "FAILED",
                            "Booking not found!",
                            null
                    ));
        }

        bookingRepository.deleteById(id);

        return ResponseEntity.ok(
                new ApiResponse(
                        "SUCCESS",
                        "Booking cancelled successfully!",
                        null
                )
        );
    }
}
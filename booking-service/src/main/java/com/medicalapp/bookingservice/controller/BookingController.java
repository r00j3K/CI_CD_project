package com.medicalapp.bookingservice.controller;

import com.medicalapp.bookingservice.dto.BookingRequest;
import com.medicalapp.bookingservice.dto.BookingResponse;
import com.medicalapp.bookingservice.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @RequestBody BookingRequest request,
            Authentication authentication,
            @RequestHeader("Authorization") String authHeader) {

        String patientEmail = authentication.getName();
        String token = authHeader.substring(7);

        return ResponseEntity.ok(
                bookingService.createBooking(request, patientEmail, token));
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings(
            Authentication authentication) {

        String patientEmail = authentication.getName();
        return ResponseEntity.ok(
                bookingService.getMyBookings(patientEmail));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable Long id,
            Authentication authentication,
            @RequestHeader("Authorization") String authHeader) {

        String patientEmail = authentication.getName();
        String token = authHeader.substring(7);

        return ResponseEntity.ok(
                bookingService.cancelBooking(id, patientEmail, token));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Booking Service is running!");
    }
}
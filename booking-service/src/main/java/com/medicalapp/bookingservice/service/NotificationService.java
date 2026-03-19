package com.medicalapp.bookingservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Slf4j
public class NotificationService {

    public void sendBookingConfirmation(String patientEmail,
                                        Long bookingId,
                                        LocalDateTime appointmentTime) {
        log.info("========================================");
        log.info("EMAIL NOTIFICATION - BOOKING CONFIRMED");
        log.info("To: {}", patientEmail);
        log.info("Booking ID: {}", bookingId);
        log.info("Appointment time: {}", appointmentTime);
        log.info("Message: Your appointment has been confirmed!");
        log.info("========================================");
    }

    public void sendCancellationConfirmation(String patientEmail,
                                             Long bookingId,
                                             LocalDateTime appointmentTime) {
        log.info("========================================");
        log.info("EMAIL NOTIFICATION - BOOKING CANCELLED");
        log.info("To: {}", patientEmail);
        log.info("Booking ID: {}", bookingId);
        log.info("Appointment time: {}", appointmentTime);
        log.info("Message: Your appointment has been cancelled.");
        log.info("========================================");
    }
}
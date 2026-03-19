package com.medicalapp.bookingservice.repository;

import com.medicalapp.bookingservice.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByPatientEmail(String patientEmail);

    List<Booking> findByPatientEmailAndStatus(
            String patientEmail,
            Booking.BookingStatus status
    );

    long countByPatientEmailAndStatus(
            String patientEmail,
            Booking.BookingStatus status
    );

    boolean existsBySlotIdAndStatus(
            Long slotId,
            Booking.BookingStatus status
    );
}
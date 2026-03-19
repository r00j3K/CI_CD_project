package com.medicalapp.bookingservice.service;

import com.medicalapp.bookingservice.client.AppointmentClient;
import com.medicalapp.bookingservice.dto.BookingRequest;
import com.medicalapp.bookingservice.dto.BookingResponse;
import com.medicalapp.bookingservice.dto.SlotResponse;
import com.medicalapp.bookingservice.model.Booking;
import com.medicalapp.bookingservice.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final AppointmentClient appointmentClient;
    private final NotificationService notificationService;

    private static final int MAX_ACTIVE_BOOKINGS = 3;

    public BookingResponse createBooking(BookingRequest request,
                                         String patientEmail,
                                         String token) {
        long activeBookings = bookingRepository.countByPatientEmailAndStatus(
                patientEmail, Booking.BookingStatus.ACTIVE);

        if (activeBookings >= MAX_ACTIVE_BOOKINGS) {
            throw new RuntimeException(
                    "Maximum number of active bookings reached (max: "
                            + MAX_ACTIVE_BOOKINGS + ")");
        }

        if (bookingRepository.existsBySlotIdAndStatus(
                request.getSlotId(), Booking.BookingStatus.ACTIVE)) {
            throw new RuntimeException(
                    "Slot is already booked: " + request.getSlotId());
        }

        SlotResponse slot = appointmentClient.getSlot(request.getSlotId(), token);

        if (slot == null || !slot.isAvailable()) {
            throw new RuntimeException(
                    "Slot is not available: " + request.getSlotId());
        }

        appointmentClient.markSlotUnavailable(request.getSlotId(), token);

        Booking booking = Booking.builder()
                .patientEmail(patientEmail)
                .slotId(request.getSlotId())
                .doctorId(request.getDoctorId())
                .appointmentTime(slot.getStartTime())
                .status(Booking.BookingStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .build();

        Booking saved = bookingRepository.save(booking);

        notificationService.sendBookingConfirmation(
                patientEmail,
                saved.getId(),
                saved.getAppointmentTime()
        );

        return mapToResponse(saved);
    }

    public List<BookingResponse> getMyBookings(String patientEmail) {
        return bookingRepository.findByPatientEmail(patientEmail)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse cancelBooking(Long bookingId,
                                         String patientEmail,
                                         String token) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException(
                        "Booking not found: " + bookingId));

        if (!booking.getPatientEmail().equals(patientEmail)) {
            throw new RuntimeException(
                    "You can only cancel your own bookings");
        }

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new RuntimeException(
                    "Booking is already cancelled: " + bookingId);
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        appointmentClient.markSlotAvailable(booking.getSlotId(), token);

        notificationService.sendCancellationConfirmation(
                patientEmail,
                booking.getId(),
                booking.getAppointmentTime()
        );

        return mapToResponse(booking);
    }

    private BookingResponse mapToResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .patientEmail(booking.getPatientEmail())
                .slotId(booking.getSlotId())
                .doctorId(booking.getDoctorId())
                .appointmentTime(booking.getAppointmentTime())
                .status(booking.getStatus().name())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
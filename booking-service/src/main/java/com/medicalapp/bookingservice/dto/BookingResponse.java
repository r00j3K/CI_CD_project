package com.medicalapp.bookingservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private Long id;
    private String patientEmail;
    private Long slotId;
    private Long doctorId;
    private LocalDateTime appointmentTime;
    private String status;
    private LocalDateTime createdAt;
}
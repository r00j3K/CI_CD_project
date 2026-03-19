package com.medicalapp.appointmentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SlotResponse {

    private Long id;
    private Long doctorId;
    private String doctorFirstName;
    private String doctorLastName;
    private String doctorSpecialization;
    private String roomNumber;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private boolean available;
}
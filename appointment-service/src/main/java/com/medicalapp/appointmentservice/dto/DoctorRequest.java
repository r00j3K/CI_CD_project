package com.medicalapp.appointmentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorRequest {

    private String firstName;
    private String lastName;
    private String specialization;
    private String roomNumber;
    private String phoneNumber;
}
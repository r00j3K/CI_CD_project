package com.medicalapp.appointmentservice.service;

import com.medicalapp.appointmentservice.dto.DoctorRequest;
import com.medicalapp.appointmentservice.dto.DoctorResponse;
import com.medicalapp.appointmentservice.model.Doctor;
import com.medicalapp.appointmentservice.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorResponse addDoctor(DoctorRequest request) {
        if (doctorRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Doctor with this phone number already exists");
        }

        Doctor doctor = Doctor.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .specialization(request.getSpecialization())
                .roomNumber(request.getRoomNumber())
                .phoneNumber(request.getPhoneNumber())
                .build();

        Doctor saved = doctorRepository.save(doctor);
        return mapToResponse(saved);
    }

    public List<DoctorResponse> getAllDoctors() {
        return doctorRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public DoctorResponse getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + id));
        return mapToResponse(doctor);
    }

    public List<DoctorResponse> getDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecialization(specialization)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private DoctorResponse mapToResponse(Doctor doctor) {
        return DoctorResponse.builder()
                .id(doctor.getId())
                .firstName(doctor.getFirstName())
                .lastName(doctor.getLastName())
                .specialization(doctor.getSpecialization())
                .roomNumber(doctor.getRoomNumber())
                .phoneNumber(doctor.getPhoneNumber())
                .build();
    }
}
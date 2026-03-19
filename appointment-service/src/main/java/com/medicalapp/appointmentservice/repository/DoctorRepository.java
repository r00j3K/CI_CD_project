package com.medicalapp.appointmentservice.repository;

import com.medicalapp.appointmentservice.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findBySpecialization(String specialization);
    boolean existsByPhoneNumber(String phoneNumber);
}
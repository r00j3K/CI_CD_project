package com.medicalapp.appointmentservice.repository;

import com.medicalapp.appointmentservice.model.AppointmentSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentSlotRepository extends JpaRepository<AppointmentSlot, Long> {

    List<AppointmentSlot> findByDoctorIdAndAvailableTrue(Long doctorId);

    List<AppointmentSlot> findByAvailableTrueAndStartTimeAfterAndStartTimeBefore(
            LocalDateTime start,
            LocalDateTime end
    );

    boolean existsByDoctorIdAndStartTime(Long doctorId, LocalDateTime startTime);
}